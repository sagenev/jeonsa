<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json: charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
date_default_timezone_set("America/Santiago"); 
$fec_hora_registro = date("Y-m-d H:i:s");
$fec_registro = date("Y-m-d");
// $data = json_decode(file_get_contents("php://input"), true);
 $_POST = json_decode(file_get_contents("php://input"), true);
 require_once '../model/Usuarios.php';
 $objUser = new Usuarios();


 if(isset($_POST['user'])){
   $allUser = $objUser->validar($_POST['user']['rutUsu'],$_POST['user']['password']);
   echo json_encode($allUser);
}

 if(isset($_POST['validarSiExisteRut'])){
   $rut = $_POST['validarSiExisteRut'];
   $resp = $objUser->validarSiExisteRut($rut);
   echo json_encode($resp);
}

 if(isset($_POST['validarSiExisteCorreo'])){
   $correo = $_POST['validarSiExisteCorreo'];
   $resp = $objUser->validarSiExisteCorreo($correo);
   echo json_encode($resp);
}

 if(isset($_POST['registrarusuarioData'])){
   $data = $_POST['registrarusuarioData'];
   $resp = $objUser->registrarusuarioData($data);
   echo json_encode($resp);
}

 if(isset($_POST['verificarCodigoLoginData'])){
   $data = $_POST['verificarCodigoLoginData'];
   $resp = $objUser->verificarCodigoLoginData($data);
   echo json_encode($resp);
}

 if(isset($_POST['changeOldPass'])){
   $data = $_POST['changeOldPass'];
   $resp = $objUser->changeOldPass($data);
   echo json_encode($resp);
}

 if(isset($_POST['askForPermiso'])){
   $rutUser = $_POST['askForPermiso'];
   $resp = $objUser->askForPermiso($rutUser);
   echo json_encode($resp);
}

 if(isset($_POST['askForSession'])){
    
    if($_SESSION){
        if ($_SESSION['accesoJeonsa']) {
            echo 1; // hay sesión abierta y puede enrutar
        }else{
            echo 2; // existe una sesión pero no es la de este sistema
        }
    }else{
        echo 2; // no hay sesión abierta y no puede enrutar
    }
}

 if(isset($_POST['cerrarSesion'])){
   // session_start();
    session_unset();
    session_destroy();

    echo 'se cerró';
}

