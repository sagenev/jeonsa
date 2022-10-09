import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button, CircularProgress, Divider, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { SnackComponent } from 'components/theme/SnackComponent';
import { checkRut, prettifyRut } from 'react-rut-formatter';
import { consultarPorAlumnoDeEscuela, getCategorias, getGrados, guardarAlumno } from 'helpers/user';
import { llamadaApi } from 'api/reqApi';

// validaciones del formulario
const validar = yup.object().shape({
    // rut del alumno
    rut: yup
        .string()
        .required('Campo requerido')
        .max(12, 'Máximo de 12 caracteres')
        .trim('No debe dejar campos en blanco')
        .strict(true)
        .test('test-name', 'Rut inválido', (value) => checkRut(value))
        .test('validarSiExisteRut', 'Este rut ya está registrado en otra escuela', async (value) => {
            // el false activa el error
            let valida=false;
            const getRutUsu = await llamadaApi.post('/controller/controlador', { validarSiExisteRutAgregarAlumno: value });
            if (getRutUsu.data) { // si encuentro al alumno, consultaré los datos del instructor que está intentando hacer el ingreso
                const getDatosInstructor = await llamadaApi.post('/controller/controlador', { validarSiExisteRutAgregarAlumno: localStorage.getItem('rut_session') });
                // aquí compararé si el fk_escuela del alumno y del insctructor son iguales, si lo son puede editarlo, sinó arrojo la alerta
                if (getRutUsu.data.fk_escuela===getDatosInstructor.data.fk_escuela) {
                    valida=true;
                }else{
                    valida=false
                }
            }else{
                valida=true;
            }
             return valida;
        }),
    // nombre del alu
    nom: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
    // apellido parterno del alu
    apeP: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
    // apellido materno del alu
    apeM: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
    // cinturón, grado
    gra: yup.string().required('Campo requerido'),
    // sexo
    sex: yup.string().required('Campo requerido'),
    // categoría
    cat: yup.string().required('Campo requerido'),
    // fecha nacimiento
    fecNac: yup.date()
    .required('Campo requerido')
    .test('validarFechaNacimiento', 'Edad minima 3 años y máxima 100 años', async (value) => {
        let vale = true
        if (value!=="") {
        
        let anios = 0;
        const nacimiento=moment(value);
        const hoy=moment();
         anios=hoy.diff(nacimiento,"years");
         if (anios<3 || anios >=100) {
            vale = false;
         }
        }
        return vale
    }),
});

export const FormAgregarAlumno = ({ hayQueEditar,sethayQueEditar }) => {

    // usquery que trae los grados
    const { data: grados, isLoading: isLoadinggrados } = useQuery('getGrados', () => getGrados())
    const { data: categorias, isLoading: isLoadingcategorias } = useQuery('getCategorias', () => getCategorias())
    // controla el botón de guardar o editar
    const [textButton, settextButton] = useState({ color: 'secondary', text: 'Guardar' });

    const queryClient = useQueryClient();
    const [snackMensaje, setSnackMensaje] = useState({
        open: false,
        mensaje: '',
        estado: 'success',
        hiddenTime: 2000
    });

    // para guardar la esuela
    const { mutate } = useMutation(guardarAlumno, {
        onSuccess: (res) => {
             queryClient.invalidateQueries('getAlumnos');
            if (res.data === 1 || res.data === 2) {
                if (res.data === 1) {
                    setSnackMensaje({
                        ...snackMensaje,
                        open: true,
                        mensaje: 'Alumno/a registrado/a correctamente',
                        estado: 'success'
                    });
                } else {
                    setSnackMensaje({
                        ...snackMensaje,
                        open: true,
                        mensaje: 'Alumno/a editado/a correctamente',
                        estado: 'success'
                    });
                    sethayQueEditar({state:false,data:[]})
                }
            } else {
                setSnackMensaje({
                    ...snackMensaje,
                    open: true,
                    mensaje: 'Ups.. Hubo un error inesperado, inténtelo nuevamente',
                    estado: 'error',
                    hiddenTime: 3500
                });
            }
        }
    });

    

    const formik = useFormik({
        initialValues: {
            rut: '',
            nom: '',
            apeP: '',
            apeM: '',
            gra: '',
            sex:'',
            fecNac:'',
            cat:''
        },
        validationSchema: validar,
        onSubmit: (values, { resetForm }) => {
            let idEditar = "";
            if (hayQueEditar.state) {
                idEditar = hayQueEditar.data[0].id
            }else{
                idEditar="";
            }
            const data = {
                ...values,
                fechaHoy: moment().format('YYYY-MM-DD HH:mm:ss'),
                rutInstructor: localStorage.getItem('rut_session'),
                idEditar
            };

             mutate(data);
             resetForm();
        }
    });

    const calcularEdadAnios =(fechaNacimiento)=>{
        let anios = 0;
        if (fechaNacimiento!=="") {
        const nacimiento=moment(fechaNacimiento);
        const hoy=moment();
         anios=hoy.diff(nacimiento,"years");
        }
        return anios;
    }

    const setCategoriaByAnios=(anios)=>{
        const cate = categorias.data;
        let categoriaSeleccionada = [];
        if (anios > 3 && anios <100) {
            for (let i = 0; i < cate.length; i+=1) {
                if (parseInt(cate[i].edadMin,10) <= anios && anios <= parseInt(cate[i].edadMax,10)) {
                    categoriaSeleccionada=cate[i];
                }
            }

            formik.setFieldValue('cat',categoriaSeleccionada.id);
        }
     
    }

    useEffect(() => {
        if (hayQueEditar.state) { // trae datos y hay que editar
            settextButton({color:'warning',text:'Editar'})
            // aplico la data a los campos existentes
            formik.setFieldValue('rut',hayQueEditar.data[0].rut)
            formik.setFieldValue('nom',hayQueEditar.data[0].nom)
            formik.setFieldValue('apeP',hayQueEditar.data[0].ape_p)
            formik.setFieldValue('apeM',hayQueEditar.data[0].ape_m)
            formik.setFieldValue('gra',hayQueEditar.data[0].fk_grado?hayQueEditar.data[0].fk_grado:"")
            formik.setFieldValue('sex',hayQueEditar.data[0].sex?hayQueEditar.data[0].sex:"")
            formik.setFieldValue('fecNac',hayQueEditar.data[0].fec_nac?hayQueEditar.data[0].fec_nac:"")
            setCategoriaByAnios(calcularEdadAnios(hayQueEditar.data[0].fec_nac)) 

        }else{
            settextButton({color:'secondary',text:'Guardar'})
            // limpio la data a los campos existentes
            formik.setFieldValue('rut','')
            formik.setFieldValue('nom','')
            formik.setFieldValue('apeP','')
            formik.setFieldValue('apeM','')
            formik.setFieldValue('gra','')
            formik.setFieldValue('sex','')
            formik.setFieldValue('fecNac','')
            formik.setFieldValue('cat','')


        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hayQueEditar])



    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container mb={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Divider textAlign="left">DATOS DEL ALUMNO</Divider>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={12} md={3} lg={3}>
                    <FormControl fullWidth>
                        <TextField
                            size="small"
                            disabled={hayQueEditar.state}
                            autoComplete="off"
                            name="rut"
                            label="Rut"
                            onChange={formik.handleChange}
                            value={formik.values.rut}
                            error={formik.touched.rut && Boolean(formik.errors.rut)}
                            helperText={formik.touched.rut && formik.errors.rut}
                            // onBlur={(e) =>
                            //     checkRut(e.target.value) ? formik.setFieldValue('rut', prettifyRut(e.target.value)) : formik.handleBlur(e)
                            // }
                            onBlur={(e)=>{
                                if (checkRut(e.target.value)) {
                                    formik.setFieldValue('rut', prettifyRut(e.target.value))
                                    consultarPorAlumnoDeEscuela(prettifyRut(e.target.value),localStorage.getItem('rut_session')).then(res=>{
                                       if (res.data.length!==0) {
                                        sethayQueEditar({state:true,data:res.data})
                                       }else{
                                        formik.handleBlur(e)
                                       }
                                        
                                    })
                                }else{
                                    formik.handleBlur(e)
                                }
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="nom"
                        label="Nombre alumno"
                        value={formik.values.nom}
                        onChange={formik.handleChange}
                        error={formik.touched.nom && Boolean(formik.errors.nom)}
                        helperText={formik.touched.nom && formik.errors.nom}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="apeP"
                        label="Apellido paterno"
                        value={formik.values.apeP}
                        onChange={formik.handleChange}
                        error={formik.touched.apeP && Boolean(formik.errors.apeP)}
                        helperText={formik.touched.apeP && formik.errors.apeP}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <TextField
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="apeM"
                        label="Apellido materno"
                        value={formik.values.apeM}
                        onChange={formik.handleChange}
                        error={formik.touched.apeM && Boolean(formik.errors.apeM)}
                        helperText={formik.touched.apeM && formik.errors.apeM}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={1} mt={1}>
                <Grid item xs={6} md={3} lg={3}>
                    <FormControl fullWidth size="small" error={formik.touched.sex && Boolean(formik.errors.sex)}>
                        <InputLabel>Sexo</InputLabel>
                        <Select
                            label="Sexo"
                            size="small"
                            name="sex"
                            value={formik.values.sex}
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                                formik.setFieldValue('sex', e.target.value);
                            }}
                        >
                            <MenuItem key={1} value="Masculino">
                                        Masculino
                            </MenuItem>
                            <MenuItem key={2} value="Femenino">
                                        Femenino
                            </MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.sex && formik.errors.sex}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                    <FormControl fullWidth size="small" error={formik.touched.gra && Boolean(formik.errors.gra)}>
                        <InputLabel>Grado</InputLabel>
                        <Select
                            label="Grado"
                            size="small"
                            name="gra"
                            value={formik.values.gra}
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                                formik.setFieldValue('gra', e.target.value);
                            }}
                        >
                            {isLoadinggrados? (
                                <CircularProgress />
                            ) : (
                                grados.data.map((gra) => (
                                    <MenuItem key={gra.id} value={gra.id}>
                                        {gra.nom}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                        <FormHelperText>{formik.touched.gra && formik.errors.gra}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                    <TextField
                        type="date"
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="fecNac"
                        InputLabelProps={{ shrink: true }}
                        label="Fecha de nacimiento"
                        value={formik.values.fecNac}
                        onChange={(e) => {
                            formik.setFieldValue('fecNac', e.target.value);
                            setCategoriaByAnios(calcularEdadAnios(e.target.value))                     
                        }}
                        error={formik.touched.fecNac && Boolean(formik.errors.fecNac)}
                        helperText={formik.touched.fecNac && formik.errors.fecNac}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                    <Tooltip title="La categoría se asigna automáticamente basándose en la fecha de nacimiento">
                    <FormControl fullWidth size="small" error={formik.touched.cat && Boolean(formik.errors.cat)}>
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            label="Categoría"
                            size="small"
                            name="cat"
                            // inputProps={{ readOnly: true }}
                            value={formik.values.cat}
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                                formik.setFieldValue('cat', e.target.value);
                            }}
                        >
                            {isLoadingcategorias ? (
                                <CircularProgress />
                            ) : (
                                categorias.data.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.nom} ({cat.edadMin}-{cat.edadMax} años)
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                        <FormHelperText>{formik.touched.sex && formik.errors.sex}</FormHelperText>
                    </FormControl>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container mt={2}>
                <Grid item xs={1.4} md={1.4} lg={1.4}>
                    <Button variant="contained" color={textButton.color} type="submit">
                        {textButton.text}
                    </Button>
                </Grid>
                {
                    hayQueEditar.state?
                    <Grid item xs={1} md={1} lg={1}>
                    <Button variant="contained" color="error" onClick={()=>sethayQueEditar({state:false,data:[]})}>
                        Cancelar
                    </Button>
                    </Grid>:
                    null
                }
                
            </Grid>
            <SnackComponent snackMensaje={snackMensaje} setSnackMensaje={setSnackMensaje} />
        </form>
    );
};
