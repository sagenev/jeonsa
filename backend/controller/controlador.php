<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json: charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
date_default_timezone_set("America/Santiago"); 
$fec_hora_registro = date("Y-m-d H:i:s");
$fec_registro = date("Y-m-d");

 $_POST = json_decode(file_get_contents("php://input"), true);
 require_once '../model/Escuelas.php';
 require_once '../model/General.php';
 $objEsc = new Escuelas();
 $objGen = new General();

 if(isset($_POST['tieneEscuela'])){
    $rutInstructor=$_POST['tieneEscuela'];
   $res = $objEsc->tieneEscuela($rutInstructor);
   echo json_encode($res);
}


 if(isset($_POST['guardarEscuela'])){
   $data=$_POST['guardarEscuela'];
   $res = $objEsc->guardarEscuela($data);
   echo json_encode($res);
 }

 if(isset($_POST['guardarAlumnoData'])){
   $data=$_POST['guardarAlumnoData'];
   $res = $objGen->guardarAlumnoData($data);
   echo json_encode($res);
}

 if(isset($_POST['guardarCampeonatoData'])){
   $data=$_POST['guardarCampeonatoData'];
   $res = $objGen->guardarCampeonatoData($data);
   echo json_encode($res);
}

 if(isset($_POST['guardarInscripcionData'])){
   $data=$_POST['guardarInscripcionData'];
   $res = $objGen->guardarInscripcion($data);
   echo json_encode($res);
}

 if(isset($_POST['valAlumnoExisteEnCategoriaActual'])){
   $data=$_POST['valAlumnoExisteEnCategoriaActual'];
   $res = $objGen->valAlumnoExisteEnCategoriaActual($data);
   echo json_encode($res);
}

 if(isset($_POST['getParticipantesByIdCampeonato'])){
   $data=$_POST['getParticipantesByIdCampeonato'];
   $res = $objGen->getParticipantesByIdCampeonato($data);
   echo json_encode($res);
}

 if(isset($_POST['getGradosData'])){
   $res = $objGen->getGradosData();
   echo json_encode($res);
}

 if(isset($_POST['getAlumnosData'])){
   $rutInstructor = $_POST['getAlumnosData'];
   $res = $objGen->getAlumnosData($rutInstructor);
   echo json_encode($res);
}

 if(isset($_POST['eliminarEquipo'])){
   $idEquipo = $_POST['eliminarEquipo'];
   $res = $objGen->eliminarEquipo($idEquipo);
   echo json_encode($res);
}

 if(isset($_POST['registrarSeminarioPoomsae'])){
   $data = $_POST['registrarSeminarioPoomsae'];
   $res = $objGen->registrarSeminarioPoomsae($data);
   echo json_encode($res);
}

 if(isset($_POST['getParticipantesData'])){
   $filtroCat = $_POST['getParticipantesData']['filtroCat'];
   $filtroRango= $_POST['getParticipantesData']['filtroRango'];
   $rutInstructor= $_POST['getParticipantesData']['rutInstructor'];
   $res = $objGen->getParticipantesData($filtroCat,$filtroRango,$rutInstructor);
   echo json_encode($res);
}

 if(isset($_POST['getCampeonatosData'])){
   $res = $objGen->getCampeonatosData();
   echo json_encode($res);
}

 if(isset($_POST['getCampeonatosInscripcionesData'])){
   $res = $objGen->getCampeonatosInscripcionesData();
   echo json_encode($res);
}

 if(isset($_POST['consultarPorAlumnoDeEscuelaData'])){
   $rutAlumno = $_POST['consultarPorAlumnoDeEscuelaData']['rutAlumno'];
   $rutInstructor = $_POST['consultarPorAlumnoDeEscuelaData']['rutInstructor'];
   $res = $objGen->consultarPorAlumnoDeEscuelaData($rutAlumno,$rutInstructor);
   echo json_encode($res);
}

 if(isset($_POST['getAlumnoByRutData'])){
   $rutAlumno = $_POST['getAlumnoByRutData'];
   $res = $objGen->getAlumnoByRutData($rutAlumno);
   echo json_encode($res);
}

 if(isset($_POST['eliminarAlumnoData'])){
   $idAlumno = $_POST['eliminarAlumnoData'];
   $res = $objGen->eliminarAlumnoData($idAlumno);
   echo json_encode($res);
}

 if(isset($_POST['eliminarCampeonatoData'])){
   $idCampeonato = $_POST['eliminarCampeonatoData'];
   $res = $objGen->eliminarCampeonatoData($idCampeonato);
   echo json_encode($res);
}

 if(isset($_POST['getCategoriasData'])){
   $res = $objGen->getCategoriasData();
   echo json_encode($res);
}

 if(isset($_POST['getCategoriasInscripcionesData'])){
   $res = $objGen->getCategoriasInscripcionesData();
   echo json_encode($res);
}

 if(isset($_POST['getSubCategoriasInscripcionesData'])){
   $idCat=$_POST['getSubCategoriasInscripcionesData'];
   $res = $objGen->getSubCategoriasInscripcionesData($idCat);
   echo json_encode($res);
}

 if(isset($_POST['validarSiExisteRutAgregarAlumno'])){
    $rut=$_POST['validarSiExisteRutAgregarAlumno'];
   $res = $objGen->validarSiExisteRutAgregarAlumno($rut);
   echo json_encode($res);
}

 if(isset($_POST['validarRutSeminario'])){
    $rut=$_POST['validarRutSeminario'];
   $res = $objGen->validarRutSeminario($rut);
   echo json_encode($res);
}

 if(isset($_POST['getDatosEscuelaData'])){
    $rutInstructor=$_POST['getDatosEscuelaData'];
   $res = $objEsc->getDatosEscuelaData($rutInstructor);
   echo json_encode($res);
}
