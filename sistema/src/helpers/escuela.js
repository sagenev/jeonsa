import { llamadaApi } from "api/reqApi";

const tieneEscuela =async(rutInstructor)=>{
    const tieneEscuela = await llamadaApi.post('/controller/controlador',{tieneEscuela:rutInstructor})  
    return tieneEscuela;
}


const getDatosEscuela =async(rutInstructor)=>{
    const getDatosEscuela = await llamadaApi.post('/controller/controlador',{getDatosEscuelaData:rutInstructor})  
    return getDatosEscuela;
}

const guardarEscuela =async(data)=>{
    const guardarEscuela = await llamadaApi.post('/controller/controlador',{guardarEscuela:data})  
    return guardarEscuela;
}

export{   
    tieneEscuela,
    guardarEscuela,
    getDatosEscuela
}