import { llamadaApi } from "api/reqApi";

const volverMostrar = async(rut)=>{
    const volverMostrar = await llamadaApi.post('/controller/userController',{volverMostrarData:rut})
    return volverMostrar;
}

const inhabilitarMensajeAyuda = async(rut)=>{
    const inhabilitarMensajeAyuda = await llamadaApi.post('/controller/userController',{inhabilitarMensajeAyudaData:rut})
    return inhabilitarMensajeAyuda;
}

const getGrados = async()=>{
    const getGrados = await llamadaApi.post('/controller/controlador',{getGradosData:'si'})
    return getGrados;
}

const getCategorias = async()=>{
    const getCategorias = await llamadaApi.post('/controller/controlador',{getCategoriasData:'si'})
    return getCategorias;
}

const getCategoriasInscripciones = async()=>{
    const getCategoriasInscripciones = await llamadaApi.post('/controller/controlador',{getCategoriasInscripcionesData:'si'})
    return getCategoriasInscripciones;
}

const getSubCategoriasInscripciones = async(idCat)=>{
    
    const getSubCategoriasInscripciones = await llamadaApi.post('/controller/controlador',{getSubCategoriasInscripcionesData:idCat})
    return getSubCategoriasInscripciones;
}

const getAlumnos = async(rutAlumno)=>{
    const getAlumnos = await llamadaApi.post('/controller/controlador',{getAlumnosData:rutAlumno})
    return getAlumnos;
}

const getParticipantes = async(filtros)=>{
    const getParticipantes = await llamadaApi.post('/controller/controlador',{getParticipantesData:filtros})
    return getParticipantes;
}

const eliminarEquipo = async(idEquipo)=>{
    const eliminarEquipo = await llamadaApi.post('/controller/controlador',{eliminarEquipo:idEquipo})
    return eliminarEquipo;
}

const getCampeonatos = async()=>{
    const getCampeonatos = await llamadaApi.post('/controller/controlador',{getCampeonatosData:'si'})
    return getCampeonatos;
}

const getCampeonatosInscripciones = async()=>{
    const getCampeonatosInscripciones = await llamadaApi.post('/controller/controlador',{getCampeonatosInscripcionesData:'si'})
    return getCampeonatosInscripciones;
}

const consultarPorAlumnoDeEscuela = async(rutAlumno,rutInstructor)=>{
    const data = {rutAlumno,rutInstructor}
    const consultarPorAlumnoDeEscuela = await llamadaApi.post('/controller/controlador',{consultarPorAlumnoDeEscuelaData:data})
    return consultarPorAlumnoDeEscuela;
}

const getAlumnoByRut = async(rutAlumno)=>{
    const getAlumnoByRut = await llamadaApi.post('/controller/controlador',{getAlumnoByRutData:rutAlumno})
    return getAlumnoByRut;
}

const eliminarAlumno = async(idAlumno)=>{
    const eliminarAlumno = await llamadaApi.post('/controller/controlador',{eliminarAlumnoData:idAlumno})
    return eliminarAlumno;
}

const eliminarCampeonato = async(idCampeonato)=>{
    const eliminarCampeonato = await llamadaApi.post('/controller/controlador',{eliminarCampeonatoData:idCampeonato})
    return eliminarCampeonato;
}

const guardarAlumno =async(data)=>{
    const guardarAlumno = await llamadaApi.post('/controller/controlador',{guardarAlumnoData:data})  
    return guardarAlumno;
}

const guardarCampeonato =async(data)=>{
    const guardarCampeonato = await llamadaApi.post('/controller/controlador',{guardarCampeonatoData:data})  
    return guardarCampeonato;
}

const registrarSeminarioPoomsae =async(data)=>{
    const registrarSeminarioPoomsae = await llamadaApi.post('/controller/controlador',{registrarSeminarioPoomsae:data})  
    return registrarSeminarioPoomsae;
}


const guardarInscripcion =async(data)=>{
    const guardarInscripcion = await llamadaApi.post('/controller/controlador',{guardarInscripcionData:data})  
    return guardarInscripcion;
}

const getParticipantesByIdCampeonato =async(data)=>{
    const getParticipantesByIdCampeonato = await llamadaApi.post('/controller/controlador',{getParticipantesByIdCampeonato:data})  
    return getParticipantesByIdCampeonato;
}

export{   
     volverMostrar, 
     inhabilitarMensajeAyuda,
     getGrados,
     getCategorias,
     guardarAlumno,
     getAlumnos,
     getAlumnoByRut,
     consultarPorAlumnoDeEscuela,
     eliminarAlumno,
     guardarCampeonato,
     getCampeonatos,
     eliminarCampeonato,
     getCampeonatosInscripciones,
     getCategoriasInscripciones,
     getSubCategoriasInscripciones,
     getParticipantes,
     guardarInscripcion,
     getParticipantesByIdCampeonato,
     eliminarEquipo,
     registrarSeminarioPoomsae,
}