import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { FastField, Field } from 'formik';
import React from 'react'

export const AlumnoTextField = ({name, label, formik, array=[],index}) => (
        <Field name={name}>
        {({ field,meta}) => (   
        
                <FormControl fullWidth   size='small'
                error={meta.touched && Boolean(meta.error)}
                >
                <InputLabel>{label}</InputLabel>
                <Select
                 size='small'          
                label={label}
                {...field}                           
                onChange={(e) => {
                    formik.setFieldValue(`${name}`, e.target.value);
                }}
                >    
                {
                    index===5?
                    <MenuItem key="0" value="0">
                        SIN SUPLENTE
                    </MenuItem>:
                    null
                }                        
                  { 
                    array.map((select) => {

                      let existe = false;
                      for (let i = 0; i < formik.values.alumnos.length; i+=1) {
                        if (formik.values.alumnos[i].idAlumno===select.id) {
                            existe = true
                        }
                      }

                       const ret = <MenuItem disabled={existe} key={select.id} value={select.id}>
                                {select.nom} {select.ape_p} {select.ape_m}
                                </MenuItem>


                      return ret
                    
                    })
                  }
                </Select>
                <FormHelperText>
                {meta.touched && meta.error}       
                </FormHelperText>
                </FormControl> 
               
         )}
    </Field>
    )
