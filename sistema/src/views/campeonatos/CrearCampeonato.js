import { Grid } from '@mui/material';
import  { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { FormAgregarCampeonato } from './FormAgregarCampeonato';
import ListaCampeonatos from './ListaCampeonatos';

export const CrearCampeonato = () => {
    // este estado me indica si hay que editar a algún alumno o no
    const [hayQueEditar, sethayQueEditar] = useState({ state: false, data: [] });
    return (
        <MainCard title="Crear campeonato">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <FormAgregarCampeonato sethayQueEditar={sethayQueEditar} hayQueEditar={hayQueEditar} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ListaCampeonatos sethayQueEditar={sethayQueEditar} />
                </Grid>
            </Grid>
        </MainCard>
    );
};
