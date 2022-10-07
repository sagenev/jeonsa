import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as yup from 'yup';
import { useFormik } from 'formik';

import { checkRut, prettifyRut } from 'react-rut-formatter';
import md5 from 'md5';
import moment from 'moment';
import { llamadaApi } from 'api/reqApi';
import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { SnackComponent } from 'components/theme/SnackComponent';
import { useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import { registrarSeminarioPoomsae } from 'helpers/user';
import { useMutation } from 'react-query';

const validar = yup.object().shape({
    rut: yup
        .string()
        .required('Campo requerido')
        .max(12, 'Máximo de 12 caracteres')
        .trim('No debe dejar campos en blanco')
        .strict(true)
        .test('test-name', 'Rut inválido', (value) => checkRut(value))
        .test('validarSiExisteRut', 'Este rut ya fue registrado', async (value) => {
            // el false activa el error
            const getRutUsu = await llamadaApi.post('/controller/controlador', { validarRutSeminario: value });
            return !getRutUsu.data;
        }),
    email: yup.string().email('Debe ser un correo valido').max(255).required('Correo requerido'),
    nombre: yup.string().trim('No debe dejar campos en blanco').max(50).required('Nombre requerido'),
    apellidop: yup.string().trim('No debe dejar campos en blanco').max(50).required('Apellido paterno requerido'),
    apellidom: yup.string().trim('No debe dejar campos en blanco').max(50).required('Apellido materno requerido'),
    escuela: yup.string().trim('No debe dejar campos en blanco').max(50).required('Escuela requerida'),
    telefono: yup.string().trim('No debe dejar campos en blanco').max(50).required('Teléfono requerido'),
    motivo: yup.string().trim('No debe dejar campos en blanco').max(50).required('Motivo requerido')
});

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://jeonsa.cl/">
                JEON-SA
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
}

const theme = createTheme();

export default function SignIn() {
    const [snackMensaje, setSnackMensaje] = useState({
        open: false,
        mensaje: '',
        estado: 'success',
        hiddenTime: 5000
    });

    // para guardar la inscripción
    const { mutate } = useMutation(registrarSeminarioPoomsae, {
        onSuccess: (res) => {
            if (res.data) {
                setSnackMensaje({
                    ...snackMensaje,
                    open: true,
                    mensaje: 'Usted se ha inscrito satisfactoriamente al seminario',
                    estado: 'success',
                    hiddenTime: 3500
                });
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
            nombre: '',
            apellidop: '',
            apellidom: '',
            email: '',
            escuela: '',
            telefono: '',
            motivo: ''
        },
        onSubmit: (values, { resetForm }) => {
            const user = {
                ...values,
                rut: prettifyRut(values.rut),
                fecRegistro: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            };
            mutate(user);
            resetForm();
        },
        validationSchema: validar
    });

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <CreateIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" textAlign="center">
                        Registro para seminario <br/> <small style={{fontSize:15}}>de formación y refreshing para árbitros de poomsae</small>
                    </Typography>
                    <Box noValidate sx={{ mt: 1 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Rut"
                                        margin="normal"
                                        name="rut"
                                        onChange={formik.handleChange}
                                        value={formik.values.rut}
                                        error={formik.touched.rut && Boolean(formik.errors.rut)}
                                        helperText={formik.touched.rut && formik.errors.rut}
                                        onBlur={(e) =>
                                            checkRut(e.target.value)
                                                ? formik.setFieldValue('rut', prettifyRut(e.target.value))
                                                : formik.handleBlur(e)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Primer nombre"
                                        margin="normal"
                                        name="nombre"
                                        value={formik.values.nombre}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                                        helperText={formik.touched.nombre && formik.errors.nombre}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Apellido paterno"
                                        margin="normal"
                                        name="apellidop"
                                        value={formik.values.apellidop}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.touched.apellidop && Boolean(formik.errors.apellidop)}
                                        helperText={formik.touched.apellidop && formik.errors.apellidop}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Apellido materno"
                                        margin="normal"
                                        name="apellidom"
                                        value={formik.values.apellidom}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.touched.apellidom && Boolean(formik.errors.apellidom)}
                                        helperText={formik.touched.apellidom && formik.errors.apellidom}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        label="Teléfono"
                                        margin="normal"
                                        name="telefono"
                                        value={formik.values.telefono}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                                        helperText={formik.touched.telefono && formik.errors.telefono}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}>
                                    <FormControl fullWidth size="small" error={formik.touched.motivo && Boolean(formik.errors.motivo)}>
                                        <InputLabel>Motivo</InputLabel>
                                        <Select
                                            label="Motivo"
                                            name="motivo"
                                            value={formik.values.motivo}
                                            onBlur={formik.handleBlur}
                                            onChange={(e) => {
                                                formik.setFieldValue('motivo', e.target.value);
                                            }}
                                        >
                                            <MenuItem key="1" value="Formación">
                                                Formación
                                            </MenuItem>
                                            <MenuItem key="2" value="Refreshing">
                                                Refreshing
                                            </MenuItem>
                                        </Select>
                                        <FormHelperText>{formik.touched.motivo && formik.errors.motivo}</FormHelperText>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label="Nombre de su escuela"
                                            autoComplete="off"
                                            type="text"
                                            value={formik.values.escuela}
                                            name="escuela"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            error={formik.touched.escuela && Boolean(formik.errors.escuela)}
                                            helperText={formik.touched.escuela && formik.errors.escuela}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label="Correo"
                                            autoComplete="off"
                                            type="email"
                                            value={formik.values.email}
                                            name="email"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {formik.errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>{formik.errors.submit}</FormHelperText>
                                </Box>
                            )}

                            <Box sx={{ mt: 2 }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={formik.isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Inscribir
                                    </Button>
                                </AnimateButton>
                            </Box>
                            <SnackComponent snackMensaje={snackMensaje} setSnackMensaje={setSnackMensaje} />
                        </form>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
