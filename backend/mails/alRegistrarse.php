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
// $mysqli = new mysqli('localhost','root','','jeonsabd');
// mysqli_set_charset($mysqli,'utf8');
if(isset($_POST['sendEmailAlNuevousuarioRegistrado'])){//
	$data = $_POST['sendEmailAlNuevousuarioRegistrado'];

	//$idUserCrea=$_POST['idUserCrea'];
	//obtenemos todos los datos de la cabecera para mostrarla en el correo
	// $sql = "SET lc_time_names = 'es_MX';";
	// $resultado=$mysqli->query($sql);


	// //esta consulta me trae el listado de firmas pendientes para la tabla
	// $sql3 = "select
	// fir.*,
	// usu.rut,
	// usu.nom,
	// usu.ape_p,
	// COALESCE(usu.ape_m,'') as ape_m,
	// usu.cargo,
	// usu.correo
	// from zt_firmas_requeridas fir
	// join zt_usuarios usu on usu.id=fir.fk_zt_usuarios
	// where fk_instructivo_cab =".$id."	ORDER BY cargo asc";
	// $resultado3=$mysqli->query($sql3);
	// $rs3=$resultado3->fetch_all(MYSQLI_ASSOC);

	// //esta consulta obtiene el nombre de quien cargó el instructivo
	// $sql2 = "select
	// usu.rut,
	// usu.nom,
	// usu.ape_p,
	// COALESCE(usu.ape_m,'') as ape_m
	// from zt_usuarios usu where id =".$idUserCrea;
	// $resultado2=$mysqli->query($sql2);
	// $rs2=$resultado2->fetch_assoc();

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
                                                <h2 class="text" style="color:#000;font-family:Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif;font-size:30px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:36px;text-transform:none;text-align:center;padding:0;margin:0"><small>¡BIENVENIDOS!</h2>
											</td>
										</tr>
										<tr>
											<td align="center" valign="top" class="imgHero">
												
													<img alt="" border="0" src="cid:logo_accion" width="230" height="230" style="display:block;color: #f9f9f9;">
											</td>
										</tr>
										<tr>
											<td style="padding-bottom: 5px; padding-left: 20px; padding-right: 20px;" align="center" valign="top" class="mainTitle">
												<h2 class="text" style="color:#000;font-family:Poppins,Helvetica,Arial,sans-serif;font-size:25px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:36px;text-transform:none;text-align:center;padding:0;margin:0">'.$data['escuela'].'<br><small></small></h2>
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
																<p class="text" style="color:#666;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:center;padding:0;margin:0">Instructor/a <b>'.$data['nombre'].' '.$data['apellidop'].'</b> le damos la bienvenida al sistema para campeonatos de la escuela JEON-SA. <b></b></p>
															</td>
														</tr>
													</tbody>
												</table>
												<table border="0" cellpadding="0" cellspacing="0" width="100%" class="tableDescription" style="padding-top:20px">
													<tbody>
														<tr>
															<td style="padding-bottom: 20px;" align="center" valign="top" class="description">
																<p class="text" style="color:#666;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:center;padding:0;margin:0">¡Estamos muy contentos de que seas parte de nuestras actividades y campeonatos!</p>
															</td>
														</tr>
													</tbody>
												</table>
												<table border="0" cellpadding="0" cellspacing="0" width="100%" class="tableDescription" style="">
													<tbody>
														<tr>
															<td style="padding-bottom: 20px;" align="center" valign="top" class="description">
																<p class="text" style="color:#666;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;font-style:normal;letter-spacing:normal;line-height:22px;text-transform:none;text-align:center;padding:0;margin:0">¡No esperes más, vamos a registrar a tus alumnos!</p>
															</td>
														</tr>
													</tbody>
												</table>
												<table border="0" cellpadding="0" cellspacing="0" width="100%" class="tableButton" style="">
													<tbody>
														<tr>
															<td style="padding-top:20px;padding-bottom:10px" align="center" valign="top">
																<table border="0" cellpadding="0" cellspacing="0" align="center">
																	<tbody>
																		<tr>
																			<td style="background-color:#F71854; padding: 12px 35px; border-radius: 50px;" align="center" class="ctaButton"> <a href="http://jeonsa.cl" style="color:#fff;font-family:Poppins,Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;font-style:normal;letter-spacing:1px;line-height:20px;text-transform:uppercase;text-decoration:none;display:block" target="_blank" class="text">Ir a JEONSA.cl</a>
																			</td>
																		</tr>
																		
																	</tbody>
																</table>
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

        $mail->Subject = '¡Bienvenido!';

        $mail->setFrom('campeonatosjeonsa@gmail.com','Sistema JEON-SA');  

        $mail->addAddress('campeonatosjeonsa@gmail.com');

        $mail->AddEmbeddedImage('./images/accion4.png', 'logo_accion');
        $mail->AddEmbeddedImage('./images/logoEscuelaChico.png', 'logo_gobm');
        $mail->AddEmbeddedImage('./images/logoEscuelaChico.png', 'logo_codelco');


        $mail->Body =  $html;

		echo $html;
        $mail->AltBody = 'Instructivo';

        $mail->CharSet = 'UTF-8';
        $mail->IsHTML(true);  

		//$mail->addBCC($correoEnviar);
		//$mail->addBCC('maximiliano.venegas@hotmail.com');
		$mail->addBCC($data['email']);
		//$mail->addBCC('escuelajeonsa@gmail.com');


if (!$mail->send())
{
	echo "Error al enviar el E-Mail: ".$mail->ErrorInfo;
}
else
{
	echo 1;
} 

 }


?> 