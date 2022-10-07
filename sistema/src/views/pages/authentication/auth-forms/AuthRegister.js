import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { llamadaApi } from 'api/reqApi';
import config from 'config';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

import { checkRut, prettifyRut } from 'react-rut-formatter';
import md5 from 'md5';

// third party
import * as yup from 'yup';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import moment from 'moment';
import { useMutation } from 'react-query';
import { enviarCorreoUsuario, registrarusuario } from 'helpers/login';
import { SnackComponent } from 'components/theme/SnackComponent';
import AlertDialog from 'components/theme/AlertDialog';

// ===========================|| FIREBASE - REGISTER ||=========================== //

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
            const getRutUsu = await llamadaApi.post('/controller/loginController', { validarSiExisteRut: value });
            return !getRutUsu.data;
        }),
    email: yup
        .string()
        .email('Debe ser un correo valido')
        .max(255)
        .required('Correo requerido')
        .test('validarSiExisteMail', 'Este correo ya está en uso', async (value) => {
            // el false activa el error
            const getCorreoUsu = await llamadaApi.post('/controller/loginController', { validarSiExisteCorreo: value });
            return !getCorreoUsu.data;
        }),
    password: yup.string().trim('No debe dejar campos en blanco').max(255).required('Contraseña requerida'),
    nombre: yup.string().trim('No debe dejar campos en blanco').max(50).required('Nombre requerido'),
    apellidop: yup.string().trim('No debe dejar campos en blanco').max(50).required('Apellido paterno requerido'),
    apellidom: yup.string().trim('No debe dejar campos en blanco').max(50).required('Apellido materno requerido'),
    escuela: yup.string().trim('No debe dejar campos en blanco').max(50).required('Escuela requerida'),
    isChecked: yup.bool().oneOf([true], 'Debe aceptar los términos y condiciones de usu para continuar')
});

const FirebaseRegister = ({ ...others }) => {
    const [snackMensaje, setSnackMensaje] = useState({
        open: false,
        mensaje: '',
        estado: 'success',
        hiddenTime: 5000
    });

    const [userDataMail, setuserDataMail] = useState([]);
    const [setOpenModal, setsetOpenModal] = useState(false);
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    const navigate = useNavigate();


    const { mutate } = useMutation(registrarusuario, {
        onSuccess: (res) => {
            if (res.data === true) {
                setSnackMensaje({
                    ...snackMensaje,
                    open: true,
                    mensaje: 'Usuario registrado correctamente, redirigiendo al login...',
                    estado: 'success',
                    hiddenTime: 4000
                });

                setTimeout(() => {
                    navigate(`${config.basename}/`);
                }, 3900);

                 enviarCorreoUsuario(userDataMail);
               
            } else {
                setSnackMensaje({
                    ...snackMensaje,
                    open: true,
                    mensaje: 'Ups.. algo salió mal al registrar, intentelo más tarde',
                    estado: 'error',
                    hiddenTime: 4500
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
            password: '',
            escuela:'',
            isChecked: false
        },
        onSubmit: (values) => {
            const user = {
                ...values,
                rut: prettifyRut(values.rut),
                password: md5(values.password),
                fecRegistro: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            };
            setuserDataMail(user);
            mutate(user);
        },
        validationSchema: validar
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit} {...others}>
                <Grid container spacing={matchDownSM ? 0 : 2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Rut"
                            margin="normal"
                            name="rut"
                            onChange={formik.handleChange}
                            value={formik.values.rut}
                            error={formik.touched.rut && Boolean(formik.errors.rut)}
                            helperText={formik.touched.rut && formik.errors.rut}
                            onBlur={(e) =>
                                checkRut(e.target.value) ? formik.setFieldValue('rut', prettifyRut(e.target.value)) : formik.handleBlur(e)
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Primer nombre"
                            margin="normal"
                            name="nombre"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                            helperText={formik.touched.nombre && formik.errors.nombre}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={matchDownSM ? 0 : 2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Apellido paterno"
                            margin="normal"
                            name="apellidop"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.apellidop && Boolean(formik.errors.apellidop)}
                            helperText={formik.touched.apellidop && formik.errors.apellidop}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Apellido materno"
                            margin="normal"
                            name="apellidom"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.apellidom && Boolean(formik.errors.apellidom)}
                            helperText={formik.touched.apellidom && formik.errors.apellidom}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={matchDownSM ? 0 : 2} mt={1}>
                    <Grid item xs={12} sm={12} mb={2}>
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
                    <Grid item xs={12} sm={12}>
                        <FormControl
                            fullWidth
                            error={Boolean(formik.touched.password && formik.errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel>Contraseña</InputLabel>
                            <OutlinedInput
                                autoComplete="off"
                                inputProps={{
                                    form: {
                                        autocomplete: 'off'
                                    }
                                }}
                                type={showPassword ? 'text' : 'password'}
                                value={formik.values.password}
                                name="password"
                                label="Contraseña"
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                    formik.setFieldValue('password', e.target.value);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {formik.touched.password && formik.errors.password && (
                                <FormHelperText error>{formik.errors.password}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}
                    </Grid>
                </Grid>

                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.isChecked}
                                    onChange={formik.handleChange}
                                    name="isChecked"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="subtitle1">
                                    Acepto los &nbsp;
                                    <Button onClick={() => setsetOpenModal(true)}>
                                        <Typography variant="subtitle1" component={Link} to="">
                                            Términos y condiciones de uso
                                        </Typography>
                                    </Button>
                                </Typography>
                            }
                        />
                        {formik.touched.isChecked && formik.errors.isChecked && (
                            <FormHelperText error>{formik.errors.isChecked}</FormHelperText>
                        )}
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
                            Registrar
                        </Button>
                    </AnimateButton>
                </Box>
                <SnackComponent snackMensaje={snackMensaje} setSnackMensaje={setSnackMensaje} />
                <AlertDialog setOpenModal={setOpenModal} setCloseModal={setsetOpenModal} />
            </form>
        </>
    );
};

export default FirebaseRegister;
