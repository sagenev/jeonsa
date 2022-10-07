
import React from 'react'
import {
    Alert,
    Button,    
    Collapse,  
    FormControl,
    Grid,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { loginUser } from 'helpers/login';
import md5 from 'md5';
import { useNavigate } from 'react-router';
import { checkRut, prettifyRut } from 'react-rut-formatter';
import config from 'config';
import { useDispatch } from 'react-redux';
import { userAction } from 'store/user/userAction';

const validar = yup.object().shape({
    rutUsu: yup.string()
    .required('Campo requerido')
    .max(12, 'Máximo de 12 caracteres')
    .trim('No debe dejar campos en blanco')
    .strict(true)
    .test('test-name','Rut inválido', (value)=>(checkRut(value))),

    password: yup.string()
                .required('Campo requerido')

})

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = ({setchangePass,setforgetPass}) => {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    const handleClose =()=>setOpen(!open)
    const navigate  = useNavigate()
   
   const{mutate} = useMutation(loginUser,{
       onSuccess:(res)=>{
        if(res.data.todoBien===1){ // inició sesión correctamente
            // aquí consulto si es necesario cambiar la password y debe cambiarla
            // if (res.data.user.changePass) {
            //   //  localStorage.setItem('idUsuReport',res.data.user.idUsu)  
            //     setchangePass(true);
            //     dispatch(userAction(res.data.user))
                
            // }else{
            //     // agregar al usuario a redux
            //      dispatch(userAction(res.data.user))
            //      navigate(`${config.basename}/avance`)
            // }

                // agregar al usuario a redux
                    localStorage.setItem('rut_session', res.data.rut_session);
                    localStorage.setItem('nom_session', res.data.nom_session);
                    localStorage.setItem('ape_session', res.data.ape_session);
                    localStorage.setItem('car_session', res.data.car_session);
                    localStorage.setItem('fec_session', res.data.fec_session);
                    localStorage.setItem('fec_permiso', res.data.fec_permiso);
                    // $_SESSION['accesoJeonsa'] = true;
                    //      $_SESSION['rut_session'] = $usu;
                    //      $_SESSION['nom_session'] = $row['nom'];
                    //      $_SESSION['ape_session'] = $row['ape_p'];
                    //      $_SESSION['car_session'] = $row['ape_m'];
                    //      $_SESSION['fec_session'] = $row['fec_crea'];
                    //      $_SESSION['fec_permiso'] = $row['permiso'];
                    //      $_SESSION['todoBien']=1;
                    dispatch(userAction(res.data))
                 // navigate(`${config.basename}/inicio`)
                 window.location.reload(true);
             
        }else{
            setOpen(true)
        }
       },
       onError:()=>{           
           setOpen(true)
       }
   })
  const olvidoClave = ()=>{
    setforgetPass(true)
    setchangePass(false)
  }

    const formik = useFormik({
        initialValues:{
            rutUsu: '',
            password:''
        },
        onSubmit:(values)=>{
       const user={
           ...values,
           rutUsu:prettifyRut(values.rutUsu),
           password:md5(values.password)
       }
            mutate(user)
        },
        validationSchema:validar
    })


  return (
    <>
        <form onSubmit={formik.handleSubmit}>
        <Grid container rowSpacing={3}>
            <Grid item md={12} xs={12}>
                <FormControl fullWidth>
                    <TextField
                        autoComplete="off"
                        name="rutUsu"
                        label="Rut"
                        onChange={formik.handleChange}
                        value={formik.values.rutUsu}
                        error={formik.touched.rutUsu && Boolean(formik.errors.rutUsu)}
                        helperText={formik.touched.rutUsu && formik.errors.rutUsu}
                        onBlur={(e) =>
                            checkRut(e.target.value)
                                ? formik.setFieldValue('rutUsu', prettifyRut(e.target.value))
                                : formik.handleBlur(e)
                        }
                    />
                </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
                <FormControl fullWidth>
                    <TextField
                        type="password"
                        value={formik.values.password}
                        name="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        label="Password"
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                </FormControl>
            </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
            <Typography
                onClick={() => olvidoClave()}
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
            >
                ¿Olvidó su clave?
            </Typography>
    
        </Stack>

    
        <Collapse in={open}>
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert   onClose={handleClose}  variant="filled" severity="error">
        Crendenciales no encontradas
        </Alert>
        </Stack>
        </Collapse>
        <Grid container alignContent="center" justifyContent="center" mt={5}>
            <Button
                disableElevation
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
            >
                Ingresar
            </Button>
            
    
        </Grid>
        <Grid>
        <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
            <Typography
                onClick={() => navigate(`${config.basename}/registrarse`)}
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
            >
                ¿Eres nuevo?, ¡Registrate! 
            </Typography>
    
        </Stack>
        </Grid>
    </form>
    </>
  )
};

export default AuthLogin;
