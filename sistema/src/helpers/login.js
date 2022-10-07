import { llamadaApi } from "api/reqApi";
import moment from 'moment';

const askForSession=async()=>{
    const loginUser = await llamadaApi.post('/controller/loginController',{askForSession:'1'})  
    return loginUser;
}

const askForPermiso=async(rutUsu)=>{
    const res = await llamadaApi.post('/controller/loginController',{askForPermiso:rutUsu})  
    return res;
}

const loginUser = async(user)=>{
    const loginUser = await llamadaApi.post('/controller/loginController',{user})
    return loginUser;
}

const registrarusuario = async(registrarusuarioData)=>{
    const registrarusuario = await llamadaApi.post('/controller/loginController',{registrarusuarioData})
    return registrarusuario;
}

const cerrarSesion = async()=>{
    const cerrarSesion = await llamadaApi.post('/controller/loginController',{cerrarSesion:'si'})
    return cerrarSesion;
}

const enviarCorreoUsuario = async(data)=>{
    const enviarCorreoUsuario = await llamadaApi.post('/mails/alRegistrarse',{sendEmailAlNuevousuarioRegistrado:data})
    return enviarCorreoUsuario;
}




const changeOldPass = async(data)=>{
   const changeOldPass = await llamadaApi.post('/controller/loginController',{changeOldPass:data})  
   return changeOldPass;
}

const askMailForNewPass = async(user)=>{     
    const askMailForNewPass = await llamadaApi.post('/reportabilidad/askMailForNewPass',{user})  
    return askMailForNewPass;
}

const recuperarClaveMail = async(mail)=>{
    const mailData = {
        ...mail,
        fecGen:moment(new Date).add(5, 'minutes').format("YYYY-MM-DD HH:mm:ss")
    }
    const recuperarClaveMail = await llamadaApi.post('/mails/alRecuperarClave',{alRecuperarClave:mailData})  
    return recuperarClaveMail;
}

const verificarCodigoLogin = async(data)=>{
    const mailData = {
        ...data,
        fecGen:moment(new Date).format("YYYY-MM-DD HH:mm:ss")
    }
    const verificarCodigoLogin = await llamadaApi.post('/controller/loginController',{verificarCodigoLoginData:mailData})
    return verificarCodigoLogin;
}

export{   
     loginUser,
     registrarusuario,
     askForSession,
     cerrarSesion,
     changeOldPass,
     askMailForNewPass,
     recuperarClaveMail,
     enviarCorreoUsuario,
     verificarCodigoLogin,
     askForPermiso
}