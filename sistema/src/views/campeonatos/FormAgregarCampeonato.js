import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
    Button,
    Divider,
    Grid,
    TextField,
} from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { SnackComponent } from 'components/theme/SnackComponent';
import { guardarCampeonato } from 'helpers/user';


// validaciones del formulario
const validar = yup.object().shape({
    // nombre del campeonato
    nom: yup.string().required('Campo requerido').max(100, 'Máximo 100 caracteres'),
    

    // fecha inicio inscripciones
    fecIniIns: yup.date().required('Campo requerido'),

    // fecha termino inscripciones
    fecTerIns: yup
        .date()
        .required('Campo requerido')
        .when('fecIniIns', (fecIniIns, schema) => fecIniIns && schema.min(fecIniIns, 'Debe ser después del inicio de inscripciones')),

    // fecha de inicio del campeonato
    fecIni:yup.date().required('Campo requerido')
    .when('fecTerIns', (fecTerIns, schema) => fecTerIns && schema.min(fecTerIns, 'Debe ser después del término de las inscripciones')),
});

export const FormAgregarCampeonato = ({ hayQueEditar = { state: false, data: [] }, sethayQueEditar }) => {
    // controla el botón de guardar o editar
    const [textButton, settextButton] = useState({ color: 'secondary', text: 'Crear' });

    const queryClient = useQueryClient();
    const [snackMensaje, setSnackMensaje] = useState({
        open: false,
        mensaje: '',
        estado: 'success',
        hiddenTime: 2000
    });

    // para guardar la esuela
    const { mutate } = useMutation(guardarCampeonato, {
        onSuccess: (res) => {
            // console.log(res)
            queryClient.invalidateQueries('getcampeonatos');
            if (res.data === 1 || res.data === 2) {
                if (res.data === 1) {
                    setSnackMensaje({
                        ...snackMensaje,
                        open: true,
                        mensaje: 'Campeonato creado correctamente',
                        estado: 'success'
                    });
                } else {
                    setSnackMensaje({
                        ...snackMensaje,
                        open: true,
                        mensaje: 'Campeonato editado correctamente',
                        estado: 'success'
                    });
                    sethayQueEditar({ state: false, data: [] });
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
            nom: '',
            fecIni: '',
            fecIniIns: '',
            fecTerIns: ''
        },
        validationSchema: validar,
        onSubmit: (values, { resetForm }) => {
            let idEditar = '';
            if (hayQueEditar.state) {
                idEditar = hayQueEditar.data[0].id;
            } else {
                idEditar = '';
            }
            const data = {
                ...values,
                fechaHoy: moment().format('YYYY-MM-DD HH:mm:ss'),
                rutInstructor: localStorage.getItem('rut_session'),
                idEditar
            };

            // console.log(data);
             mutate(data);
             resetForm();
        }
    });

    useEffect(() => {
        if (hayQueEditar.state) { // trae datos y hay que editar
            settextButton({color:'warning',text:'Editar'})
            // aplico la data a los campos existentes
             formik.setFieldValue('nom',hayQueEditar.data[0].nom)
             formik.setFieldValue('fecIniIns',hayQueEditar.data[0].fec_ini_ins)
             formik.setFieldValue('fecTerIns',hayQueEditar.data[0].fec_ter_ins)
             formik.setFieldValue('fecIni',hayQueEditar.data[0].fec_inicio)
        }else{
            settextButton({color:'secondary',text:'Crear'})
            console.log(hayQueEditar)
            // limpio la data a los campos existentes
            formik.setFieldValue('nom','')
             formik.setFieldValue('fecIniIns','')
             formik.setFieldValue('fecTerIns','')
             formik.setFieldValue('fecIni','')

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hayQueEditar])

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container mb={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Divider textAlign="left">DATOS DEL CAMPEONATO</Divider>
                </Grid>
            </Grid>

            <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={4} lg={4}>
                    <TextField
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="nom"
                        label="Nombre del campeonato"
                        value={formik.values.nom}
                        onChange={formik.handleChange}
                        error={formik.touched.nom && Boolean(formik.errors.nom)}
                        helperText={formik.touched.nom && formik.errors.nom}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={2.5} lg={2.5}>
                    <TextField
                        type="date"
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="fecIniIns"
                        InputLabelProps={{ shrink: true }}
                        label="Fecha inicio de inscripciones"
                        value={formik.values.fecIniIns}
                        onChange={(e) => {
                            formik.setFieldValue('fecIniIns', e.target.value);
                        }}
                        error={formik.touched.fecIniIns && Boolean(formik.errors.fecIniIns)}
                        helperText={formik.touched.fecIniIns && formik.errors.fecIniIns}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={2.5} lg={2.5}>
                    <TextField
                        type="date"
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="fecTerIns"
                        InputLabelProps={{ shrink: true }}
                        label="Fecha inicio de inscripciones"
                        value={formik.values.fecTerIns}
                        onChange={(e) => {
                            formik.setFieldValue('fecTerIns', e.target.value);
                        }}
                        error={formik.touched.fecTerIns && Boolean(formik.errors.fecTerIns)}
                        helperText={formik.touched.fecTerIns && formik.errors.fecTerIns}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={2.5} lg={2.5}>
                    <TextField
                        type="date"
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="fecIni"
                        InputLabelProps={{ shrink: true }}
                        label="Fecha inicio del campeonato"
                        value={formik.values.fecIni}
                        onChange={(e) => {
                            formik.setFieldValue('fecIni', e.target.value);
                        }}
                        error={formik.touched.fecIni && Boolean(formik.errors.fecIni)}
                        helperText={formik.touched.fecIni && formik.errors.fecIni}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
            </Grid>
            
            <Grid container mt={2} spacing={1}>
                <Grid item xs={1.6} md={1.6} lg={1.6}>
                    <Button variant="contained" color={textButton.color} type="submit">
                        {textButton.text}
                    </Button>
                </Grid>
                {hayQueEditar.state ? (
                    <Grid item xs={1} md={1} lg={1}>
                        <Button variant="contained" color="error" onClick={() => sethayQueEditar({ state: false, data: [] })}>
                            Cancelar
                        </Button>
                    </Grid>
                ) : null}
            </Grid>
            <SnackComponent snackMensaje={snackMensaje} setSnackMensaje={setSnackMensaje} />
        </form>
    );
};
