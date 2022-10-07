import {Formik, Form} from 'formik';
import datosJson from './Data.json'
import { Button } from '@mui/material';
import { CustomInput } from 'components/forms/CustomField';
import * as yup from 'yup'

const initialValues={};
const validarCampos={};

// const validador=[
//     {
//         "type":"required"
//     },
//     {
//         "type":"trim"
//     },
//     {
//         "type":"strict"
//     }
//    ]

// datosJson.map((datos,index)=>{
//     if(datos.id===3){
//         datosJson[index].validar=[...validador]
//     }
//     return datos
// })


datosJson.map(dato=>{ 
    // si vienen datos, hay que pasarle el name para obtener el value. tb sirve para validar los campos
   initialValues[dato.name] = dato.value

     if(dato.validador){
        let campo = yup.string()
     
         dato.validador.map(validar=>{
            if(validar.type==='required'){
                campo = campo.required('Campo requerido')            
             }  
            if(validar.type==='trim'){
                campo= campo.trim('No deje campos en blanco')     
             }
             if(validar.type==='strict'){
                campo= campo.strict()     
             }
             if(validar.type==='fecha'){
                campo = yup.date()
                campo= campo.required('Campo requerido')     
                campo= campo.typeError('Ingrese una fecha válida')                              
             }
           
             return validar            
         })
         validarCampos[dato.name] = campo
     }
   return dato    
}

)

const validar = yup.object().shape({...validarCampos})

export const FormikDynamic = () => (
    <Formik 
       initialValues={initialValues}
       validationSchema={validar}
       onSubmit={values=>{console.log(values)}}
    >
        {(formik)=>(
             <Form>
                 {datosJson.map(campo=>{
                    console.log('')
                    return <CustomInput key={campo.id} label={campo.label} name={campo.name} type={campo.type} formik={formik}/>
                 })}
                <Button type='submit'>Enviar</Button>
             </Form>
          
        )}
    </Formik>
  )

