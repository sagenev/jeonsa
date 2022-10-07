import { Button, CircularProgress, Divider, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Formik, useFormik } from 'formik';
import { getCampeonatosInscripciones, getCategorias, getCategoriasInscripciones, getSubCategoriasInscripciones } from 'helpers/user';
import { useQuery } from 'react-query';
import MainCard from 'ui-component/cards/MainCard';
import * as yup from 'yup';
import { useState } from 'react';
import { FormInscripciones } from './FormInscripciones';
import ListadoEquipos from './ListadoEquipos';

// validaciones del formulario
// const validar = yup.object().shape({
//     // campeonato
//     campeonato: yup.string().required('Campo requerido'),
//     cat: yup.string().required('Campo requerido'),

// });

export const Inscripciones = () => {
    // usquery que trae los campeonatos
    const { data: campeonatos, isLoading: isLoadingcampeonatos } = useQuery('getCampeonatosInscripciones', () =>
        getCampeonatosInscripciones()
    );

    // usquery que trae las categorías en las que se puede participar
    const { data: categorias, isLoading: isLoadingcategorias } = useQuery('getCategoriasInscripciones', () => getCategoriasInscripciones());

    // usquery que trae las categorías a los que pueden pertenecer los participantes
    const { data: categoriasAlumnos, isLoading: isLoadingcategoriasAlumnos } = useQuery('getCategorias', () => getCategorias())



    return (
            <MainCard title="Inscripciones">
                    {
                    isLoadingcampeonatos&&isLoadingcategorias&&isLoadingcategoriasAlumnos?
                    <CircularProgress/>
                    :
                    <>
                    <FormInscripciones campeonatos={campeonatos} categorias={categorias} categoriasAlumnos={categoriasAlumnos} />
                    </>
                    
                   }
            </MainCard>
        
    );
};
