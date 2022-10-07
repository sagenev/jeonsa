import { useQuery } from 'react-query';
import MainCard from 'ui-component/cards/MainCard';
import { tieneEscuela } from 'helpers/escuela';
import { Grid } from '@mui/material';
import { FormAgregarEscuela } from './FormAgregarEscuela';

export const AgregarEscuela = () => {
    // const queryClient = useQueryClient();
    // usquery que consultará si tiene o no tiene una escuela asociada
    const { data: tieneEscuelaData, isLoading: isLoadingTieneEscuela } = useQuery(
        ['TieneEscuela', localStorage.getItem('rut_session')],
        () => tieneEscuela(localStorage.getItem('rut_session'))
    );

    return (
        <MainCard title="Administrar mi escuela">
            <Grid container spacing={2}>                
                <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormAgregarEscuela data={!isLoadingTieneEscuela&&tieneEscuelaData.data!==false?tieneEscuelaData.data:[]} />
                </Grid>
            </Grid>

          
        </MainCard>
    );
};
