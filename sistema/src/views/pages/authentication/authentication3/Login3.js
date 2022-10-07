// import { Link } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import { purple } from '@mui/material/colors';
import AuthNewPass from '../auth-forms/AuthNewPass';
import { useEffect, useState } from 'react';
import ForgetPass from '../auth-forms/ForgetPass';


// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
    const [changePass, setchangePass] = useState(false)
    const [forgetPass,setforgetPass] = useState(false)
    const [textos,settextos] = useState({text:'Bienvenido',subText:'Por favor, ingrese sus credenciales'})
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (!changePass&&!forgetPass) {
            settextos({
                text:'Bienvenido',
                subText:'Por favor, ingrese sus credenciales'
            }) 
        }else if(changePass&&!forgetPass){
            settextos({
                text:'Atención',
                subText:'Debe cambiar su contraseña'
            }) 
        }else if(!changePass&&forgetPass){
            settextos({
                text:'Ingrese su correo',
                subText:'Si el correo corresponde al que tenemos registrado le enviaremos un código de activación'
            }) 
        }
    }, [changePass,forgetPass])
    
    return (
        <AuthWrapper1>
            <Grid container direction="row" justifyContent="flex-end" >
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" >
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item >                                        
                                            <Logo />                                      
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={purple[600]}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                       {textos.text}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign='center'
                                                    >
                                                       {textos.subText}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {
                                    !changePass&&!forgetPass?
                                    <Grid item xs={12}>
                                        <AuthLogin setchangePass={setchangePass} setforgetPass={setforgetPass} />
                                    </Grid>
                                    :
                                    <Grid item xs={12}>
                                        {changePass&&!forgetPass?<AuthNewPass setchangePass={setchangePass} setforgetPass={setforgetPass} />:<ForgetPass setchangePass={setchangePass} setforgetPass={setforgetPass} />}
                                    </Grid>
                                    }
                                    
                                </Grid>
                                
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
