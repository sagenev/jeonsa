
import React from 'react'
import {
    Alert,
    Button,    
    Collapse,  
    FormControl,
    Grid,
    Stack,
    TextField,
} from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { changeOldPass } from 'helpers/login';
import md5 from 'md5';
import { LoadingButton } from '@mui/lab';

const validar = yup.object().shape({
    password: yup.string().trim().required('Campo requerido')
    // eslint-disable-next-line
    // .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.{8,12})/,
    //     "La nueva contraseña debe contener entre 8 y 12 caracteres, al menos una mayúscula y al menos un número"
    // )
    // .max(12,'Máximo 12 caracteres'),
    ,
    passwordConfirmation: yup.string()
     .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')

})

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthNewPass = ({setchangePass,setforgetPass}) => {

    const [open, setOpen] = React.useState(false);
    const [mensajeAlert, setmensajeAlert] = React.useState({
        mensaje:'',
        severity:'error',
        color:''
    })


    const volverLogin=()=>{
        localStorage.removeItem('idUsu')
        setchangePass(false)
        setforgetPass(false)
    }
    const handleClose =()=>setOpen(!open)
   
   const{mutate} = useMutation(changeOldPass,{
       onSuccess:(res)=>{
        if (res.data) {
            setmensajeAlert({
                mensaje:'cambio exitoso, redirigiendo al login...',
                severity:'success',
                color:'green'
            })
          setOpen(true)         
          setTimeout(() => {
            volverLogin()
          }, 2500);
        }else{
            setOpen(true)
        }
       
       }
         
   })

    const formik = useFormik({
        initialValues:{
            password:'',
            passwordConfirmation:''
        },
        onSubmit:(values)=>{
       const user={
           password:md5(values.password),
           idUser:localStorage.getItem('idUsu')   
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
                        type="password"
                        value={formik.values.password}
                        name="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        label="Nueva password"
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
                <FormControl fullWidth>
                    <TextField
                        type="password"
                        value={formik.values.passwordConfirmation}
                        name="passwordConfirmation"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        label="Confirmar password"
                        error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                        helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                    />
                </FormControl>
            </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
            <></>
        </Stack>
    
        <Collapse in={open}>
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert   onClose={handleClose}  variant="filled" severity={mensajeAlert.severity}>
        {mensajeAlert.mensaje}
        <LoadingButton
          size="medium"
          loading
          disabled
        ><></></LoadingButton>
        </Alert>
        </Stack>
        </Collapse>
        <Grid container alignContent="center" justifyContent="center" mt={5}>
            <Grid item xs={4}>
            <Button
                disableElevation
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
            >
                Cambiar
            </Button>
            </Grid>
            <Grid item xs={4}>
            <Button
                disableElevation
                size="large"
                color="error"
                variant="contained"
                onClick={volverLogin}
            >
                Cancelar
            </Button>
            </Grid>
    
        </Grid>
    </form>
    </>
  )
};

export default AuthNewPass;
