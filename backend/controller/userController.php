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


 if(isset($_POST['volverMostrarData'])){
    $rut=  $_POST['volverMostrarData'];
   $resp = $objUser->volverMostrarData($rut);
   echo json_encode($resp);
}

 if(isset($_POST['inhabilitarMensajeAyudaData'])){
    $rut=  $_POST['inhabilitarMensajeAyudaData'];
   $resp = $objUser->inhabilitarMensajeAyudaData($rut);
   echo json_encode($resp);
}
