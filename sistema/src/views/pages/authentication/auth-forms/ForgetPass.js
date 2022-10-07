import React, { useState } from 'react';
import { Alert, Button, Collapse, FormControl, Grid, Stack, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { recuperarClaveMail, verificarCodigoLogin } from 'helpers/login';
// import { useNavigate } from 'react-router';

const validar = yup.object().shape({
    email: yup
        .string()
        .when('send', {
            is: false,
            then: yup.string().required('Campo requerido')
        })
        .email('Ingrese un email valido'),
    number: yup.number().when('send', {
        is: true,
        then: yup
            .number('debe ser un numero')
            .required('Código requerido')
            .min(99999, 'Debe ser un código de 6 dígitos')
            .max(999999, 'Debe ser un código de 6 dígitos')
    })
});

// ============================|| FIREBASE - LOGIN ||============================ //

const ForgetPass = ({ setchangePass, setforgetPass }) => {
    const [sendedEmail, setsendedEmail] = useState(false);
    const [open, setOpen] = useState(false);
    const [idUserClave, setidUserClave] = useState(0);
    const [mensajeAlert, setmensajeAlert] = React.useState({
        mensaje: '',
        severity: 'error',
        color: ''
    });

    const volverLogin = () => {
        setchangePass(false);
        setforgetPass(false);
        setsendedEmail(false);
        localStorage.removeItem('idUsu');
    };

    const handleClose = () => setOpen(!open);
    // const navigate  = useNavigate()

    const { mutate: recuperarClaveMutate } = useMutation(recuperarClaveMail, {
        onSuccess: (res) => {
            setidUserClave(res.data);
        }
    });

    const { mutate: mutateSetCod } = useMutation(verificarCodigoLogin, {
        onSuccess: (res) => {
            if (res.data) {
                setsendedEmail(true);
                setmensajeAlert({
                    mensaje: 'Código verificado',
                    severity: 'success',
                    color: 'green'
                });
                setTimeout(() => {
                    setchangePass(true);
                    setforgetPass(false);
                    setsendedEmail(false);
                }, 1000);
                localStorage.setItem('idUsu', idUserClave);
                setOpen(true);
            }else{
                    setmensajeAlert({
                        mensaje: 'Código incorrecto',
                        severity: 'error',
                        color: 'green'
                    });
                    setOpen(true);
            }
        }
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: '',
            number: '',
            send: sendedEmail,
            idUser: idUserClave
        },
        onSubmit: (values) => {
            const passToken = localStorage.getItem('passToken');
            const user = {
                ...values,
                passToken
            };

            if (!sendedEmail) {
                recuperarClaveMutate(user);
                setsendedEmail(true);
            } else {
                mutateSetCod(user);
            }
        },
        validationSchema: validar
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Grid container rowSpacing={3}>
                    <Grid item md={12} xs={12}>
                        {sendedEmail ? (
                            <Typography textAlign="center" variant="body2">
                                Ingrese a continuación el código de 6 dígitos que enviamos a su correo
                            </Typography>
                        ) : null}
                    </Grid>
                    {!sendedEmail ? (
                        <Grid item md={12} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    type="email"
                                    value={formik.values.email}
                                    name="email"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    label="Ingrese su email"
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </FormControl>
                        </Grid>
                    ) : null}
                    {sendedEmail ? (
                        <Grid item md={12} xs={12} textAlign="center">
                            <FormControl fullWidth>
                                <TextField
                                    type="number"
                                    value={formik.values.number}
                                    name="number"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    label="Ingrese el código"
                                    error={formik.touched.number && Boolean(formik.errors.number)}
                                    helperText={formik.touched.number && formik.errors.number}
                                    hidden
                                />
                            </FormControl>
                        </Grid>
                    ) : null}
                </Grid>

                <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
                    <></>
                </Stack>

                <Collapse in={open}>
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert onClose={handleClose} variant="filled" severity={mensajeAlert.severity}>
                            {mensajeAlert.mensaje}
                        </Alert>
                    </Stack>
                </Collapse>
                <Grid container alignContent="center" justifyContent="center" mt={5}>
                    <Grid item xs={3}>
                        <Button disableElevation size="large" type="submit" variant="contained" color="secondary">
                            Enviar
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button disableElevation size="large" color="error" variant="contained" onClick={volverLogin}>
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    );
};

export default ForgetPass;
