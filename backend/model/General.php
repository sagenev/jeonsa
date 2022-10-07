<?php

require_once $_SERVER['DOCUMENT_ROOT'].'/jeonsa/backend/connection/Conexion.php';

Class General extends Conexion{

    public function __construct(){
        $this->conexion = new Conexion();
        $this->conexion = $this->conexion->connect();        
    }

     public function getGradosData(){
        $sql = "select * from grados where act=1";
        $query = $this->conexion->prepare($sql);
        $query->execute();
        $request = $query->fetchAll(PDO::FETCH_ASSOC);
        return $request;
    }

     public function getAlumnoByRutData($rutAlumno){
        $sql = "select * from usu where rut=? and act=1";
        $query = $this->conexion->prepare($sql);
        $query->execute([$rutAlumno]);
        $request = $query->fetchAll(PDO::FETCH_ASSOC);
        return $request;
    }

     public function eliminarAlumnoData($idAlumno){
        $sql = "update usu set act=0 where id=?";
        $query = $this->conexion->prepare($sql);
        $request=$query->execute([$idAlumno]);
        return $request;
    }

     public function eliminarCampeonatoData($idCampeonato){
        $sql = "update campeonato set act=0 where id=?";
        $query = $this->conexion->prepare($sql);
        $request=$query->execute([$idCampeonato]);
        return $request;
    }

     public function consultarPorAlumnoDeEscuelaData($rutAlumno,$rutInstructor){
        $sql = "select 
        usu.*,
        esc.fk_instructor
        from usu 
        join escuela esc on esc.id=usu.fk_escuela
        where usu.act=1 and usu.rut=? and esc.fk_instructor=?";
        $query = $this->conexion->prepare($sql);
        $query->execute([$rutAlumno,$rutInstructor]);
        $request = $query->fetchAll(PDO::FETCH_ASSOC);
        return $request;
    }

     public function getAlumnosData($rutInstructor){
        $sql = "select 
        usu.*,
        gra.nom as nom_gra,
        esc.nom as nom_esc,
        esc.fk_instructor as rut_instructor,
		DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),usu.fec_nac)), '%Y')+0 AS Edad,
		(select nom from categorias_edad where edadMin <= Edad and Edad <= edadMax) as cat,
		(select edadMin from categorias_edad where edadMin <= Edad and Edad <= edadMax) as edad_min,
		(select edadMax from categorias_edad where edadMin <= Edad and Edad <= edadMax) as edad_max
        from usu
        left join grados gra on gra.id=usu.fk_grado
        left join escuela esc on esc.id = usu.fk_escuela
        where esc.fk_instructor = ? and usu.act=1
        ORDER BY fec_crea desc";
        $query = $this->conexion->prepare($sql);
        $query->execute([$rutInstructor]);
        $request = $query->fetchAll(PDO::FETCH_ASSOC);
        return $request;
    }

     public function getParticipantesData($filtroCat,$filtroRango,$rutInstructor){

        $fil = "0"; // el filtro para la busqueda
        if ($filtroRango==1) {// principiantes
            $fil="1,2";
        }else if ($filtroRango==2) {// iniciales
            $fil="3,4,5,6";
        }else if ($filtroRango==3) {// avanzados
            $fil="7,9,11,13";
        }else if ($filtroRango==4) {// avanzados ELITE
            $fil="8,10,12,14";
        }else if ($filtroRango==5) {// EXPERTO
            $fil="15";
        }else if ($filtroRango==6) {// EXPERTO ELITE
            $fil="16";
        }

        // primero consulto por el rango etario de la categoría seleccionada
        $sql = 'select * from categorias_edad where id = ? and act=1';
        $query = $this->conexion->prepare($sql);
        $query->execute([$filtroCat]);
        $request = $query->fetchAll(PDO::FETCH_ASSOC);

        $edadMax=0;
        $edadMin=0;

        if (count($request)>0) {// seleccionó la categoría
         $edadMax=$request[0]['edadMax']; 
         $edadMin=$request[0]['edadMin'];  
        }

        $sql = 'select 
        usu.*,
        escuela.fk_instructor
        FROM 
        usu
        join escuela on escuela.id=usu.fk_escuela
        where usu.tip_usu = 2 and usu.act=1 and fk_instructor = ? and usu.fk_grado in ('.$fil.')
        and (TIMESTAMPDIFF(YEAR,usu.fec_nac,CURDATE())>=? and TIMESTAMPDIFF(YEAR,usu.fec_nac,CURDATE()) <= ?)';
        $query = $this->conexion->prepare($sql);
        $query->execute([$rutInstructor,$edadMin,$edadMax]);
        $request = $query->fetchAll(PDO::FETCH_ASSOC);
        
        return $request;
    }

     public function getCampeonatosData(){
        $sql = "select 
        cam.*,
        usu.nom as nom_usu,
        usu.ape_p,
        usu.ape_m,
		DATE(now()) as fecha_hoy
        from campeonato cam
        join usu on usu.rut= cam.rut_crea
        where cam.act=1";
        $query = $this->conexion->prepare($sql);
        $query->execute();
        $request = $query->fetchAll(PDO::FETCH_ASSOC);
        return $request;
    }

     public function getCampeonatosInscripcionesData(){
        $sql = "select 
        cam.*,
        usu.nom as nom_usu,
        usu.ape_p,
        usu.ape_m,
		DATE(now()) as fecha_hoy
        from campeonato cam
        join usu on usu.rut= cam.rut_crea
        where cam.act=1 and (cam.fec_ini_ins<=date(now()) and cam.fec_ter_ins>=date(now()))";
        $query = $this->conexion->prepare($sql);
        $query->execute();
        $request = $query->fetchAll(PDO::FETCH_ASSOC);
        return $request;
    }

     public function getCategoriasData(){
        $sql = "select * from categorias_edad where act=1";
        $query = $this->conexion->prepare($sql);
        $query->execute();
        $request = $query->fetchAll(PDO::FETCH_ASSOC);
        return $request;
    }



        public function getCategoriasInscripcionesData(){
            $sql = "select * from cat_campeonato where act=1";
            $query = $this->conexion->prepare($sql);
            $query->execute();
            $request = $query->fetchAll(PDO::FETCH_ASSOC);
            return $request;
        }

        public function getSubCategoriasInscripcionesData($idCat){
            $sql = "select * from sub_cat_campeonato where act=1 and fk_cat_campeonato=?";
            $query = $this->conexion->prepare($sql);
            $query->execute([$idCat]);
            $request = $query->fetchAll(PDO::FETCH_ASSOC);
            return $request;
        }
        
        public function getParticipantesByIdCampeonato($data){
            $sql = "select 
            ins.id as id_ins,
            equ.id as id_equipo,
            cat.id as id_cat,
            cat.nom as nom_cat,
            subCat.id as id_subCat,
            subCat.nom as nom_subCat,
            mie.fk_alumno,
            usu.nom as nom_usu,
            usu.ape_p,
            usu.ape_m,
            mie.tip_participante,
            grados.nom as nom_grado,
            escuela.fk_instructor,
            ins.fec_insc,
            edad.nom as nom_cat_edad,
            subGra.nom as nom_sub_grado
            from inscripciones ins
            join equipos equ on equ.id = ins.fk_equipo
            join mie_equipo mie on mie.fk_equipo=equ.id
            join sub_cat_campeonato subCat on subCat.id=equ.fk_sub_cat_campeonato
            join cat_campeonato cat on cat.id = subCat.fk_cat_campeonato
            join usu on usu.id = mie.fk_alumno
            join grados on grados.id = usu.fk_grado
            join escuela on escuela.id = usu.fk_escuela
            join categorias_edad edad on edad.id= equ.fk_cat_edad
            join sub_cat_grados subGra on subGra.id = grados.fk_cat_grados
            where ins.act=1 and ins.fk_campeonato=? and escuela.fk_instructor=?";
            $query = $this->conexion->prepare($sql);
            $query->execute([$data['idCampeonato'],$data['rutInstructor']]);
            $request = $query->fetchAll(PDO::FETCH_ASSOC);
            return $request;
        }

        public function valAlumnoExisteEnCategoriaActual($data){
            $sql = "select 
            ins.id as id_ins,
            equ.id as id_equipo,
            cat.id as id_cat,
            cat.nom as nom_cat,
            subCat.id as id_subCat,
            subCat.nom as nom_subCat,
            mie.fk_alumno 
            from inscripciones ins
            join equipos equ on equ.id = ins.fk_equipo
            join mie_equipo mie on mie.fk_equipo=equ.id
            join sub_cat_campeonato subCat on subCat.id=equ.fk_sub_cat_campeonato
            join cat_campeonato cat on cat.id = subCat.fk_cat_campeonato
            where ins.act=1 and ins.fk_campeonato=? and mie.fk_alumno=? and cat.id=?";
            $query = $this->conexion->prepare($sql);
            $query->execute([$data['idCampeonato'],$data['idAlumno'],$data['idCategoria']]);
            $request = $query->fetchAll(PDO::FETCH_ASSOC);
            return $request;
        }

     public function validarSiExisteRutAgregarAlumno($rut){
        $sql = "select * from usu where rut = ? and act=1";
        $query = $this->conexion->prepare($sql);
        $query->execute([$rut]);
        $request = $query->fetch(PDO::FETCH_ASSOC);
        return $request;
    }

     public function validarRutSeminario($rut){
        $sql = "select * from seminario_arbitros where rut = ? and act=1";
        $query = $this->conexion->prepare($sql);
        $query->execute([$rut]);
        $request = $query->fetch(PDO::FETCH_ASSOC);
        return $request;
    }



    public function guardarAlumnoData($data){
            // primero traigo los datos de la escuela para asociarla al alumno registrado
            $sqlEsc ='select * from escuela where fk_instructor = ?';
            $queryEsc = $this->conexion->prepare($sqlEsc);
            $queryEsc->execute([$data['rutInstructor']]);
            $requestEsc = $queryEsc->fetch(PDO::FETCH_ASSOC);
            if ($requestEsc) {
                //con esta variable sabré si edité o guardé
                $editoGuardo=0;
                if ($data['idEditar']=="") {
                    $editoGuardo=1; // 1 = guardé
                    $sql ='insert into usu(rut,nom,ape_p,ape_m,fec_crea,sex,fk_grado,fec_nac,tip_usu,fk_escuela) values (?,?,?,?,?,?,?,?,?,?)';
                    $query = $this->conexion->prepare($sql);
                    $request = $query->execute([
                       $data['rut'],
                       $data['nom'],
                       $data['apeP'],
                       $data['apeM'],
                       $data['fechaHoy'],
                       $data['sex'],
                       $data['gra'],
                       $data['fecNac'],
                       2,
                       $requestEsc['id'],
                   ]);

                }else{
                    $editoGuardo=2; // 2 = edité
                    $sql ='update usu set 
                    nom=?,
                    ape_p=?,
                    ape_m=?,
                    sex=?,
                    fk_grado=?,
                    fec_nac=?
                    where id=? ';
                    $query = $this->conexion->prepare($sql);
                    $request = $query->execute([
                        $data['nom'],
                        $data['apeP'],
                        $data['apeM'],
                        $data['sex'],
                        $data['gra'],
                        $data['fecNac'],
                        $data['idEditar']
                   ]);
                }

                if ($request) {
                    return $editoGuardo;
                }else{
                    return 3; // un 3 es que algo salió mal
                }
            }else{
                return 3;
            }


     }

    public function guardarCampeonatoData($data){
                //con esta variable sabré si edité o guardé
                $editoGuardo=0;
                if ($data['idEditar']=="") {
                    $editoGuardo=1; // 1 = guardé
                    $sql ='insert into campeonato(
                    fec_inicio,
                    fec_ini_ins,
                    fec_ter_ins,
                    rut_crea,
                    fec_reg,
                    act,
                    nom
                    ) values (?,?,?,?,?,?,?)';
                    $query = $this->conexion->prepare($sql);
                    $request = $query->execute([
                       $data['fecIni'],
                       $data['fecIniIns'],
                       $data['fecTerIns'],
                       $data['rutInstructor'],
                       $data['fechaHoy'],
                       1,
                       $data['nom'],
                   ]);

                }else{
                    $editoGuardo=2; // 2 = edité
                    $sql ='update campeonato set 
                    fec_inicio=?,
                    fec_ini_ins=?,
                    fec_ter_ins=?,
                    rut_crea=?,
                    fec_reg=?,
                    nom=?
                    where id=?';
                    $query = $this->conexion->prepare($sql);
                    $request = $query->execute([
                        $data['fecIni'],
                        $data['fecIniIns'],
                        $data['fecTerIns'],
                        $data['rutInstructor'],
                        $data['fechaHoy'],
                        $data['nom'],
                        $data['idEditar']
                   ]);
                }

                if ($request) {
                    return $editoGuardo;
                }else{
                    return 3; // un 3 es que algo salió mal
                }
            


     }

    public function guardarInscripcion($data){
                //con esta variable sabré si edité o guardé
                $editoGuardo=0;
                // en caso de algún error este lo validará
                $catchError = 0;

                if ($data['idEditar']=="") {

                    $editoGuardo=1; // 1 = guardé

                    // el primer paso es crear el equipo
                    $sql ='insert into equipos(
                        fk_sub_cat_campeonato,
                        fk_cat_edad
                        ) values (?,?)';
                        $query = $this->conexion->prepare($sql);
                    try
                    { 
                    $request = $query->execute([
                       $data['subCat'],
                       $data['catAlumno'],
                   ]);
                } catch (PDOException $e) {
                    $return = "Your fail message: " . $e->getMessage();
                    $catchError = 1; // algo falló
                }

                   

                   // aquí capturo el id del equipo creado
                   $idEquipo = $this->conexion->lastInsertId();

                   // aqhora crearé la tabla con los miembros del equipo  y los asociaré a ella
                   // como puede venir más de un participante, armaré la cadena sql a travez de un ciclo for
                    $cadenaSql = "";
                    for ($i=0; $i < count($data['alumnos']); $i++) {
                        if ($i==5) {// si da 6 vueltas es por que viene un suplente, este debe ir con otro tipo
                            if ($data['alumnos'][$i]['idAlumno']==0) {
                              $cadenaSql=$cadenaSql."";
                            }else{
                             $cadenaSql =$cadenaSql."($idEquipo,".$data['alumnos'][$i]['idAlumno'].",2),";
                            }
                            
                        }else{
                            $cadenaSql =$cadenaSql."($idEquipo,".$data['alumnos'][$i]['idAlumno'].",1),";
                        }
                       
                    }

                    // elimino la última , para evitar errores
                    $cadenaSql = substr($cadenaSql, 0, -1);

                    // ya tengo creada la cadena de insert, ahora la ejecuto
                    $sql ='insert into mie_equipo(
                        fk_equipo,
                        fk_alumno,
                        tip_participante
                    ) values '.$cadenaSql;
                    $query = $this->conexion->prepare($sql);

                    try {
                    $request = $query->execute();

                    } catch (PDOException $e) {
                        $return = "Your fail message: " . $e->getMessage();
                        $catchError = 1; // algo falló
                    }

                    // ya creamos el equipo los miembros del equipo ahora debemos crear la inscripción al campeonato
                    $sql ='insert into inscripciones(
                        fk_campeonato,
                        fk_equipo,
                        fec_insc
                    ) values (?,?,now())';
                    $query = $this->conexion->prepare($sql);

                    try {
                    $request = $query->execute([$data['campeonato'],$idEquipo]);

                    } catch (PDOException $e) {
                        $return = "Your fail message: " . $e->getMessage();
                        $catchError = 1; // algo falló
                    }

                    if ($catchError==1) {// algó falló durante el proceso
                        return 3;
                    }else{
                        return $editoGuardo;
                    }
                   
                }else{
                    $editoGuardo=2; // 2 = edité
                    $sql ='update campeonato set 
                    fec_inicio=?,
                    fec_ini_ins=?,
                    fec_ter_ins=?,
                    rut_crea=?,
                    fec_reg=?,
                    nom=?
                    where id=?';
                    $query = $this->conexion->prepare($sql);
                    $request = $query->execute([
                        $data['fecIni'],
                        $data['fecIniIns'],
                        $data['fecTerIns'],
                        $data['rutInstructor'],
                        $data['fechaHoy'],
                        $data['nom'],
                        $data['idEditar']
                   ]);
                }

                // if ($request) {
                //     return $editoGuardo;
                // }else{
                //     return 3; // un 3 es que algo salió mal
                // }
            
        // return 1;

     }

     public function eliminarEquipo($idEquipo){
        // primero elimino la inscripción del equipo 
        $sql = "delete from inscripciones where fk_equipo = ?";
        $query = $this->conexion->prepare($sql);
        $request=$query->execute([$idEquipo]);

        // luego elimino a los miembros del equipo
        $sql = "delete from mie_equipo where fk_equipo = ?";
        $query = $this->conexion->prepare($sql);
        $request=$query->execute([$idEquipo]);

        // luego elimino el equipo
        $sql = "delete from equipos where id = ?";
        $query = $this->conexion->prepare($sql);
        $request=$query->execute([$idEquipo]);
        return $request;
    }

    public function registrarSeminarioPoomsae($data){
        $sql = "insert into seminario_arbitros(
            rut,
            nombre,
            ape_p,
            ape_m,
            tel,
            motivo,
            nom_escuela,
            correo
        ) values (?,?,?,?,?,?,?,?)";
        $query = $this->conexion->prepare($sql);
        $request= $query->execute([
            $data['rut'],
            $data['nombre'],
            $data['apellidop'],
            $data['apellidom'],
            $data['telefono'],
            $data['motivo'],
            $data['escuela'],
            $data['email']
        ]);
        return $request;
    }


}