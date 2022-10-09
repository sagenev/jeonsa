import axios from "axios";

 // const baseURL='http://localhost/jeonsa/backend';
 const baseURL='https://jeonsa.cl/jeonsa/backend';

const llamadaApi = axios.create({
       baseURL, 
})


export{
    llamadaApi
}

