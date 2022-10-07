import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button, Divider, Grid, TextField } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { guardarEscuela } from 'helpers/escuela';
import { SnackComponent } from 'components/theme/SnackComponent';

// validaciones del formulario
const validar = yup.object().shape({
    // nombre de la escuela
    nom: yup.string().required('Nombre de escuela requerido').max(50, 'Máximo 50 caracteres'),
    // teléfono de la escuela
    num: yup.string("no dejar vació").required('Télefono requerido').min(8, 'Mínimo 8 dígitos').max(8, 'Máximo 8 dígitos'),
    // dirección de la escuela
    dir: yup.string().required('Dirección requerida').max(100, 'Máximo 100 caracteres')
});

export const FormAgregarEscuela = ({data=[]}) => {
    // controla el botón de guardar o editar
    const [textButton, settextButton] = useState({color:'secondary',text:'Guardar escuela'})

    // este estado controla si el formulario se edita o no, en el caso de editarse se guarda el id a editar
    const [seEdita, setseEdita] = useState({state:false,idEditar:""})
    const queryClient = useQueryClient();
    const [snackMensaje, setSnackMensaje] = useState({
        open: false,
        mensaje: '',
        estado: 'success',
        hiddenTime: 2000
    });


    

        // para guardar la esuela
        const { mutate } = useMutation(guardarEscuela, {
            onSuccess: (res) => {
                queryClient.invalidateQueries('getDatosEscuela');
                queryClient.invalidateQueries('TieneEscuela');
                if (res.data===1 || res.data===2) {
                    if (res.data===1) {
                        setSnackMensaje({
                            ...snackMensaje,
                            open: true,
                            mensaje: 'Escuela registrada correctamente',
                            estado: 'success'
                        });
                    }else{
                        setSnackMensaje({
                            ...snackMensaje,
                            open: true,
                            mensaje: 'Escuela editada correctamente',
                            estado: 'success'
                        });
                    }
                }else{
                    setSnackMensaje({
                        ...snackMensaje,
                        open: true,
                        mensaje: 'Ups.. Hubo un error inesperado, inténtelo nuevamente',
                        estado: 'error',
                        hiddenTime:3500
                    });
                }
            }
        });

    const formik = useFormik({
        initialValues: {
            nom: '',
            num: '',
            dir: ''
        },
        validationSchema: validar,
        onSubmit: (values) => {
            const data = {
                ...values,
                fechaHoy: moment().format('YYYY-MM-DD HH:mm:ss'),
                rutInstructor:localStorage.getItem('rut_session'),
                idEditar:seEdita.idEditar
            };
            mutate(data);
             // resetForm();
        }
    });

    useEffect(() => {
        if (data.length!==0) { // trae datos
            setseEdita({state:true,idEditar:data.id})
            settextButton({color:'warning',text:'Editar escuela'})

            // aplico la data a los campos existentes
            formik.setFieldValue('nom',data.nom)
            formik.setFieldValue('num',data.num || "")
            formik.setFieldValue('dir',data.dir || "")
        }else{
            setseEdita({state:false,idEditar:''})
            settextButton({color:'secondary',text:'Guardar escuela'})
            // limpio la data a los campos existentes
            formik.setFieldValue('nom',"")
            formik.setFieldValue('num',"")
            formik.setFieldValue('dir',"")
            
        }
   // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container mb={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Divider textAlign="left">DATOS DE LA ESCUELA</Divider>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4}>
                    <TextField
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="nom"
                        label="Nombre de la escuela"
                        value={formik.values.nom}
                        onChange={formik.handleChange}
                        error={formik.touched.nom && Boolean(formik.errors.nom)}
                        helperText={formik.touched.nom && formik.errors.nom}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                    <TextField
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="num"
                        label="Teléfono"
                        value={formik.values.num}
                        onChange={formik.handleChange}
                        error={formik.touched.num && Boolean(formik.errors.num)}
                        helperText={formik.touched.num && formik.errors.num}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        fullWidth
                        size="small"
                        autoComplete="off"
                        name="dir"
                        label="Dirección"
                        value={formik.values.dir}
                        onChange={formik.handleChange}
                        error={formik.touched.dir && Boolean(formik.errors.dir)}
                        helperText={formik.touched.dir && formik.errors.dir}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1} mt={2}> 

                        <Grid item>
                        <Button variant='contained' color={textButton.color} type='submit'>
                            {textButton.text}
                        </Button>
                        </Grid>
            </Grid>
            <SnackComponent snackMensaje={snackMensaje} setSnackMensaje={setSnackMensaje} />
        </form>
    );
};
