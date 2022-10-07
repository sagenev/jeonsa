<?php

require_once $_SERVER['DOCUMENT_ROOT'].'/jeonsa/backend/connection/Conexion.php';

Class Escuelas extends Conexion{

    public function __construct(){
        $this->conexion = new Conexion();
        $this->conexion = $this->conexion->connect();        
    }

    public function tieneEscuela($rutInstructor){
        
         $sql ='select 
         escuela.*
         FROM escuela 
         join usu on usu.rut=escuela.fk_instructor
         where escuela.fk_instructor=? and escuela.act=1 and usu.act=1';

         $query = $this->conexion->prepare($sql);
         $query->execute([$rutInstructor]);
         $request = $query->fetch(PDO::FETCH_ASSOC);
         if($request!=null){
             return $request; // existe el rut en el sistema
         }else{
             return $request; // no existe el rut en el sistema
         }
     }

    public function guardarEscuela($data){
        // con esta variable sabré si edité o guardé
        $editoGuardo=0;
        if ($data['idEditar']=="") {

            $editoGuardo=1; // 1 = guardé
            $sql ='insert into escuela(nom,num,dir,fk_instructor,fec_crea) values (?,?,?,?,?)';
            $query = $this->conexion->prepare($sql);
            $request = $query->execute([
               $data['nom'],
               $data['num'],
               $data['dir'],
               $data['rutInstructor'],
               $data['fechaHoy'],
           ]);
           // obtengo el id de la escuela recién insertada
           $idEscuela = $this->conexion->lastInsertId();
           // ahora asociaré al instructor a su propia escuela    
           $sqlinsert ='update usu set fk_escuela = ? where rut=? and act=1';
            $queryinsert = $this->conexion->prepare($sqlinsert);
            $request = $queryinsert->execute([
               $idEscuela,
               $data['rutInstructor'],
           ]);

        }else{
            $editoGuardo=2; // 2 = edité
            $sql ='update escuela set nom=?,num=?,dir=? where id=?';
            $query = $this->conexion->prepare($sql);
            $request = $query->execute([
               $data['nom'],
               $data['num'],
               $data['dir'],
               $data['idEditar']
           ]);
        }

        if ($request) {
            return $editoGuardo;
        }else{
            return 3; // un 3 es que algo salió mal
        }

     }

     public function getDatosEscuelaData($rutInstructor){
        $sql = "select * from escuela where fk_instructor = ? and act=1";
        $query = $this->conexion->prepare($sql);
        $query->execute([$rutInstructor]);
        $request = $query->fetch(PDO::FETCH_ASSOC);
        return $request;
    }



}