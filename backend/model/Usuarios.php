<?php

require_once $_SERVER['DOCUMENT_ROOT'].'/jeonsa/backend/connection/Conexion.php';

Class Usuarios extends Conexion{

    public function __construct(){
        $this->conexion = new Conexion();
        $this->conexion = $this->conexion->connect();        
    }

    public function validar($usu, $pas){
         $sql = "select * from usu where rut=? and pass=? and act=1";
         $query = $this->conexion->prepare($sql);
         $query->execute([$usu,$pas]);
         $request = $query->fetchAll(PDO::FETCH_ASSOC);
         if($request!=null){
             foreach($request as $row){
                      // session_start();
                     //Regenerar la session
                     
                      session_regenerate_id(true);
                         $_SESSION['accesoJeonsa'] = true;
                         $_SESSION['rut_session'] = $usu;
                         $_SESSION['nom_session'] = $row['nom'];
                         $_SESSION['ape_session'] = $row['ape_p'];
                         $_SESSION['car_session'] = $row['ape_m'];
                         $_SESSION['fec_session'] = $row['fec_crea'];
                         $_SESSION['fec_permiso'] = $row['permiso'];
                         $_SESSION['todoBien']=1;
             }
             return $_SESSION; // el 1 indica que inició sesión correctamente
         }else{
             return 2; // el 2 indica que no existe ese usuario
         }
     }

    public function validarSiExisteRut($rut){
         $sql = "select * from usu where rut=? and act=1";
         $query = $this->conexion->prepare($sql);
         $query->execute([$rut]);
         $request = $query->fetchAll(PDO::FETCH_ASSOC);
         if($request!=null){
             return true; // existe el rut en el sistema
         }else{
             return false; // no existe el rut en el sistema
         }
     }


    public function validarSiExisteCorreo($correo){
         $sql = "select * from usu where ema=? and act=1";
         $query = $this->conexion->prepare($sql);
         $query->execute([$correo]);
         $request = $query->fetchAll(PDO::FETCH_ASSOC);
         if($request!=null){
             return true; // existe el correo en el sistema
         }else{
             return false; // no existe el correo en el sistema
         }
     }

    public function registrarusuarioData($data){

        $sql2 ='insert into escuela(nom,fk_instructor,fec_crea) values (?,?,?)';
        $query2 = $this->conexion->prepare($sql2);
        $request2 = $query2->execute([
           $data['escuela'],
           $data['rut'],
           $data['fecRegistro'],
       ]);

       $idEscuela = $this->conexion->lastInsertId();

         $sql = "insert into usu(rut,nom,ape_p,ape_m,fec_crea,pass,permiso,ema,tip_usu,fk_escuela) values(?,?,?,?,?,?,?,?,?,?)";
         $query = $this->conexion->prepare($sql);
         $request=$query->execute([
            $data['rut'],
            $data['nombre'],
            $data['apellidop'],
            $data['apellidom'],
            $data['fecRegistro'],
            $data['password'],
            'INSzNjk9',// el permiso que será instructor por defecto
            $data['email'],
            1,
            $idEscuela
            ]
        );


         
         if($request!=null && $request2!=null){
             return true; // se ingresó correctamente
         }else{
             return false; // ocurrió algún error
         }
     }


     public function volverMostrarData($rut){
        $sql = "select * from usu where rut=? and act=1";
        $query = $this->conexion->prepare($sql);
        $query->execute([$rut]);
        $request = $query->fetch(PDO::FETCH_ASSOC);
        if($request!=null){
            if ($request['volMos']==1) {
                return true;
            }else if($request['volMos']==2){
                return false;
            }
        }else{
            return false;
        }
    }

     public function verificarCodigoLoginData($data){
        $sql = "select * from recuperar_clave where fk_usu = ? and codigo = ? and fec_gen>=?";
        $query = $this->conexion->prepare($sql);
        $query->execute([
            $data['idUser'],
            $data['number'],
            $data['fecGen']
        ]);
        $request = $query->fetch(PDO::FETCH_ASSOC);
        if($request!=null){
            return true;
        }else{
            return false;
        }
    }

     public function changeOldPass($data){

        $sql = "update usu set pass=? where id=?";
        $query = $this->conexion->prepare($sql);
        $request = $query->execute([
            $data['password'],
            $data['idUser']
        ]);
        
        return $request;
    }

     public function inhabilitarMensajeAyudaData($rut){
        $sql = "update usu set volMos=0 where rut=? and act=1";
        $query = $this->conexion->prepare($sql);
        $request=$query->execute([$rut]);
        return $request;
    }

     public function askForPermiso($rutUser){
        $sql = "select * from usu where rut=? and act=1";
        $query = $this->conexion->prepare($sql);
        $query->execute([$rutUser]);
        $request = $query->fetch(PDO::FETCH_ASSOC);
        if ($request) {
            return $request;
        }else{
            return 3; // es error
        }
    }
   

}