
import MainCard from 'ui-component/cards/MainCard';
import { Grid } from '@mui/material';
import AlertClose from 'components/theme/AlertClose';
import { FormAgregarAlumno } from './FormAgregarAlumno';
import { useQuery } from 'react-query';
import { tieneEscuela } from 'helpers/escuela';
import ListaAlumnos from './ListaAlumnos';
import { useState } from 'react';
import MensajeInicio from 'views/sample-page/MensajeInicio';


export const MisAlumnos = () => {
    // const queryClient = useQueryClient();
    // este estado me indica si hay que editar a algún alumno o no
    const [hayQueEditar, sethayQueEditar] = useState({state:false,data:[]})

    // usquery que consultará si tiene o no tiene una escuela asociada
    const { data: tieneEscuelaData, isLoading: isLoadingTieneEscuela } = useQuery(
        ['TieneEscuela', localStorage.getItem('rut_session')],
        () => tieneEscuela(localStorage.getItem('rut_session'))
    );

    return (
        <MainCard title="Mis alumnos">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                {
                  !isLoadingTieneEscuela&&tieneEscuelaData.data!==false?
                  <FormAgregarAlumno hayQueEditar={hayQueEditar} sethayQueEditar={sethayQueEditar} />
                  :
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                  <AlertClose defaultOpen mensaje='Aún no haz creado tu escuela, ¡hazlo para poder registrar a tus alumnos!' severity='error'/>
                </Grid>
                }
                    
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ListaAlumnos sethayQueEditar={sethayQueEditar} />
                </Grid>
            </Grid>

            <MensajeInicio/>
        </MainCard>
    );
};
