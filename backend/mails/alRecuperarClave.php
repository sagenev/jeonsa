<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json: charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
date_default_timezone_set("America/Santiago");
 $_POST = json_decode(file_get_contents("php://input"), true); 

require './PHPMailer/PHPMailer.php';
require './PHPMailer/SMTP.php';
require './PHPMailer/Exception.php';
require './PHPMailer/OAuth.php';

//include_once $_SERVER['DOCUMENT_ROOT']."../includes/config.php"; //este funciona en el servidor
include_once "./config.php";
$mysqli = new mysqli('localhost','root','','jeonsabd');
mysqli_set_charset($mysqli,'utf8');
if(isset($_POST['alRecuperarClave'])){//
	$data = $_POST['alRecuperarClave'];
	$codigo= rand(100000,999999);
	$correo = $_POST['alRecuperarClave']['email'];
	$fecGen = $_POST['alRecuperarClave']['fecGen'];

	//$idUserCrea=$_POST['idUserCrea'];
	//obtenemos todos los datos de la cabecera para mostrarla en el correo
	$sql = "SET lc_time_names = 'es_MX';";
	$resultado=$mysqli->query($sql);


	// //esta consulta me trae el listado de firmas pendientes para la tabla
	$sql = "select * from usu where ema = '".$correo."' and act=1";
	$resultado=$mysqli->query($sql);
	$rs3=$resultado->fetch_all(MYSQLI_ASSOC);
	$valido = 0;
	if (count($rs3)<=0) {//no se encontró el correo
		$valido=0;
	}else{// el correo existe y hay que enviar
		$valido = 1;
		//reviso si existe otra solicitud para este usuario, si es así la edito, sinó la creo
		$sql = "select * from recuperar_clave where fk_usu = ".$rs3[0]['id'];
		$resultado=$mysqli->query($sql);
		$rs4=$resultado->fetch_all(MYSQLI_ASSOC);
		if (count($rs4)<=0){// no existe, la creo
		$sql = "insert into recuperar_clave(fk_usu,codigo,fec_gen) values(".$rs3[0]['id'].",".$codigo.",'".$fecGen."')";
		$mysqli->query($sql);
		}else{
		$sql = "update recuperar_clave set codigo=".$codigo.",fec_gen='".$fecGen."' where fk_usu =".$rs3[0]['id'];
		$mysqli->query($sql);
		}

	}


	$html = '
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>

</style>
<body>
    <!-- © 2018 Shift Technologies. All rights reserved. -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;background-color:#f9f9f9" id="bodyTable">
	<tbody>
		<tr>
			<td style="padding-right:10px;padding-left:10px;" align="center" valign="top" id="bodyCell">
				<table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapperBody" style="max-width:600px">
					<tbody>
						<tr>
							<td align="center" valign="top">
								<table border="0" cellpadding="0" cellspacing="0" width="100%" class="tableCard" style="background-color:#fff;border-color:#e5e5e5;border-style:solid;border-width:0 1px 1px 1px;">
									<tbody>
										<tr>
											<td style="background-color:#F71854;font-size:1px;line-height:3px" class="topBorder" height="3">&nbsp;</td>
										</tr>

										<tr>
											<td style="padding-top: 7px;padding-left:7px"  class="imgHero">
												<div>
														<img alt="" border="0" src="cid:logo_gobm" width="70" height="auto" style="display:block;color: #f9f9f9;">
												</div>

											</td>
										</tr>
										
										<tr>
											<td style="padding-bottom: 10px;" align="center" valign="middle" class="emailLogo">
                                                <h2 class="text" style="color:#000;font-family:Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif;font-size:30px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:36px;text-transform:none;text-align:center;padding:0;margin:0"><small>Recupera tu contraseña</h2>
											</td>
										</tr>
										<tr>
											<td align="center" valign="top" class="imgHero">
												
													<img alt="" border="0" src="cid:logo_accion" width="150" height="160" style="display:block;color: #f9f9f9;">
											</td>
										</tr>
										
										<tr>
											<td style="padding-bottom: 5px; padding-left: 20px; padding-right: 20px;" align="center" valign="top" class="mainTitle">
												<h2 class="text" style="color:#000;font-family:Poppins,Helvetica,Arial,sans-serif;font-size:25px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:36px;text-transform:none;text-align:center;padding:0;margin:0">Su código es : '.$codigo.'<br><small></small></h2>
											</td>
										</tr>
										<tr>
											<td style="padding-bottom: 30px; padding-left: 20px; padding-right: 20px;" align="center" valign="top" class="subTitle">
												<h4 class="text" style="color:#999;font-family:Poppins,Helvetica,Arial,sans-serif;font-size:10px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:24px;text-transform:none;text-align:center;padding:0;margin:0"></h4>
											</td>
										</tr>
										<tr>
											<td style="padding-left:20px;padding-right:20px" align="center" valign="top" class="containtTable ui-sortable">
												<table border="0" cellpadding="0" cellspacing="0" width="100%" class="tableDescription" style="">
													<tbody>
														<tr>
															<td style="padding-bottom: 20px;" align="center" valign="top" class="description">
																<p class="text" style="color:#666;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:center;padding:0;margin:0">Ingrese este código en el sitio para poder reestablecer su contraseña <b></b></p>
															</td>
														</tr>
													</tbody>
												</table>
												<table border="0" cellpadding="0" cellspacing="0" width="100%" class="tableDescription" style="padding-top:20px">
													<tbody>
														<tr>
															<td style="padding-bottom: 20px;" align="center" valign="top" class="description">
																<p class="text" style="color:#666;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:center;padding:0;margin:0">Este código solo será valido por los próximos 5 minutos.</p>
															</td>
														</tr>
													</tbody>
												</table>
												<table border="0" cellpadding="0" cellspacing="0" width="100%" class="tableDescription" style="">
													<tbody>
														<tr>
															<td style="padding-bottom: 20px;" align="center" valign="top" class="description">
																<p class="text" style="color:#666;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:center;padding:0;margin:0">Si usted no ha solicitado este código solo ignore este correo.</p>
															</td>
														</tr>
													</tbody>
												</table>
												
											</td>
										</tr>
										<tr>
											<td style="font-size:1px;line-height:1px" height="20">&nbsp;</td>
										</tr>
										
									</tbody>
								</table>
								<table border="0" cellpadding="0" cellspacing="0" width="100%" class="space">
									<tbody>
										<tr>
											<td style="font-size:1px;line-height:1px" height="30">&nbsp;</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
				<table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapperFooter" style="max-width:600px">
					<tbody>
						<tr>
							<td align="center" valign="top">
								<table border="0" cellpadding="0" cellspacing="0" width="100%" class="footer">
									<tbody>
										
										<tr>
											<td style="padding: 10px 10px 5px;" align="center" valign="top" class="brandInfo">
												<p class="text" style="color:#bbb;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:20px;text-transform:none;text-align:center;padding:0;margin:0">©&nbsp; JEON-SA - ESCUELA DE TAEKWONDO</p>
											</td>
										</tr>

										<tr>
											<td style="padding: 0px 10px 10px;" align="center" valign="top" class="footerEmailInfo">
												<p class="text" style="color:#bbb;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:20px;text-transform:none;text-align:center;padding:0;margin:0">Este es un correo electrónico generado de forma automática; por favor no lo responda.</p>
											</td>
										</tr>
										<tr>
											<td style="font-size:1px;line-height:1px" height="15">&nbsp;</td>
										</tr>
										<tr>
											<td align="center" valign="top" class="imgHero">
												
												<img alt="" border="0" src="cid:logo_codelco" width="100" height="auto" style="display:block;color: #f9f9f9;">

											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td style="font-size:1px;line-height:1px" height="30">&nbsp;</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
	</tbody>
</table>
</body>
</html>
';

$mail = new PHPMailer\PHPMailer\PHPMailer();

        $mail->isSMTP();

        $mail->SMTPDebug = 0;

        $mail->Host = 'smtp.gmail.com';

        $mail->Port = 587;

        $mail->SMTPSecure = 'tls';

        $mail->SMTPAuth = true;

        $mail->Username = "campeonatosjeonsa@gmail.com";

        $mail->Password = "hzwdcthysjdctzpj";

        $mail->Subject = 'Recuperar contraseña';

        $mail->setFrom('campeonatosjeonsa@gmail.com','Sistema JEON-SA');  

        $mail->addAddress('campeonatosjeonsa@gmail.com');

        $mail->AddEmbeddedImage('./images/recuperar.png', 'logo_accion');
        $mail->AddEmbeddedImage('./images/logoEscuelaChico.png', 'logo_gobm');
        $mail->AddEmbeddedImage('./images/logoEscuelaChico.png', 'logo_codelco');


        $mail->Body =  $html;

        $mail->CharSet = 'UTF-8';
        $mail->IsHTML(true);  

		//$mail->addBCC($correoEnviar);
		//$mail->addBCC('maximiliano.venegas@hotmail.com');
		$mail->addBCC($correo);
		//$mail->addBCC('escuelajeonsa@gmail.com');

		if ($valido==1) {
			if (!$mail->send())
			{
				echo "Error al enviar el E-Mail: ".$mail->ErrorInfo;
			}
			else
			{
				echo json_encode($rs3[0]['id']);
			} 
		}else{
			echo 2;
		}



 }


?> 