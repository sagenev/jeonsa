// material-ui
import { Typography } from '@mui/material';


// project imports
import MainCard from 'ui-component/cards/MainCard';
import MensajeInicio from './MensajeInicio';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
    <MainCard title="Bienvenido">
        <Typography variant="body2">
            Al sistema de administración JEON SA (aquí luego irá el dashboard)
        </Typography>
        <MensajeInicio/>
    </MainCard>
);

export default SamplePage;
