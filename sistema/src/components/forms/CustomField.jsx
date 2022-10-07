import { Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import { Field } from 'formik'
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import esLocale from "date-fns/locale/es";

export const CustomInput = ({label,name,type, formik,array,nomSelectDependiente, setSelect,direction,row}) => { 

    switch(type){
        case 1:  // input
            return(              
                <Field name={name}>
                    {({ field,meta}) => (   
                        <FormControl fullWidth>
                         <TextField  
                        {...field}                  
                        size="small"
                        autoComplete="off"  
                        label={label}
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched && meta.error}                  
                          />         
                        </FormControl>        
                       
                     )}
                </Field>
           )
        case 2:  // radioButton
            return(
                <Field name={name}>
                    {({ field,meta}) => ( 
                        <FormControl fullWidth
                        error={meta.touched && Boolean(meta.error)}                       
                        >   
                        <RadioGroup
                            {...field} 
                            name={name} 
                            row={row}
                        > 
                        {array.map(radio=>(
                            <FormControlLabel key={radio.id} value={radio.id} control={<Radio />} label={radio.nom} />
                        ))}

                        </RadioGroup>
                            <FormHelperText>
                             {meta.touched && meta.error}
                             </FormHelperText>
                        </FormControl>        
            
                     )}
                </Field>
            )
            case 3:   // fecha 
                return(
                <Field name={name}>
                    {({ field,meta}) => (  
                        <FormControl fullWidth>  
                   <LocalizationProvider 
                   dateAdapter={AdapterDateFns}
                   locale={esLocale}
                   >
                        <DatePicker    
                            label={label}
                            {...field}
                            name={name}                          
                            onChange={(fecha) => {
                            formik.setFieldValue(`${name}`,fecha)                          
                            }}
                            renderInput={(params) => <TextField 
                                                        {...params}  
                                                        size='small'                                                       
                                                        error={meta.touched && Boolean(meta.error)}
                                                        helperText={meta.touched && meta.error}            
                                                        />}
                        />
                        </LocalizationProvider>
                        </FormControl>    
                     )}                     
                </Field>
                )
            case 4:  // checkbox
                return(                     
                    <Field name={name}>
                    {({ field,meta}) => (   
                   <FormControl                  
                   fullWidth
                   sx={{display:'flex', flexDirection:`${direction}`} }
                   error={meta.touched && Boolean(meta.error)}
                 >                 
                            {array.map(check=>(                           
                            <FormControlLabel key={check.id} control={<Checkbox
                             {...field}
                             name={name} 
                             value={check.id}                              
                              />} label={check.nom} />  
                             )
                      
                  )}
                   <FormHelperText error>
                        {meta.touched && meta.error}        
                   </FormHelperText>
                 </FormControl>
                     )}
                </Field>                  
                )
            case 5:  // select
                return(
                    <Field name={name}>
                    {({ field,meta}) => (   
                            <FormControl fullWidth size="small"
                            error={meta.touched && Boolean(meta.error)}
                            >
                            <InputLabel>{label}</InputLabel>
                            <Select
                            size="small"
                            label={label}
                            {...field}                           
                            onChange={(e) => {
                                formik.setFieldValue(`${name}`, e.target.value);                              
                            }}
                            >                            
                              { 
                                array.map((select) => (
                                    <MenuItem key={select.id} value={select.id}>
                                    {select.nom}
                                    </MenuItem>
                                ))
                              }
                            </Select>
                            <FormHelperText>
                            {meta.touched && meta.error}       
                            </FormHelperText>
                            </FormControl> 
             
                     )}
                </Field>
                )
            case 6: // select dependiente
            return(

              <Field name={name}>
              {({ field,meta}) => (   
                      <FormControl fullWidth size="small"
                      error={meta.touched && Boolean(meta.error)}
                      >
                      <InputLabel>{label}</InputLabel>
                      <Select
                      size="small"
                      label={label}
                      {...field}                           
                      onChange={(e) => {
                          formik.setFieldValue(`${name}`, e.target.value);
                          formik.setFieldValue(`${nomSelectDependiente}`,'')
                          setSelect(e.target.value)
                      }}
                      >                            
                        { 
                          array.map((select) => (
                              <MenuItem key={select.id} value={select.id}>
                              {select.nom}
                              </MenuItem>
                          ))
                        }
                      </Select>
                      <FormHelperText>
                      {meta.touched && meta.error}       
                      </FormHelperText>
                      </FormControl> 
       
               )}
          </Field>
          )
        
            default:
                return null
    }

}






/* Guía, no borrar

        <Field name="lastName">
             {({
               field, // { name, value, onChange, onBlur }
               form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
             }) => (
               <div>
                 <input type="text" placeholder="Email" {...field} />
                 {meta.touched && meta.error && (
                   <div className="error">{meta.error}</div>
                 )}
               </div>
             )}
           </Field>
*/
