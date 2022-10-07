<?php
 class Conexion{

   private $host     = "localhost";
   private $user     = "root"; 
   private $password = "";
   private $db       = "jeonsabd";
   private $conect;
 //  Jcwc,V21%tO6


   public function __construct(){
       $connnectionString = "mysql:host=".$this->host.";dbname=".$this->db.";charset=utf8";
       try {
          $this->conect = new PDO($connnectionString, $this->user, $this->password);
          $this->conect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      

       } catch (Exception $e) {
           $this->conect = "Error de conexión";
           echo "Error ". $e->getMessage();
       }
   }

   public function connect(){
     return $this->conect;
   }

 }

?>