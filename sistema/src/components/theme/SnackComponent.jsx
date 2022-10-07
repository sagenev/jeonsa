import { Alert, Snackbar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

    export const SnackComponent = ({snackMensaje,setSnackMensaje}) => {   
    
    const {open, mensaje, estado,hiddenTime} = snackMensaje;
   
    const handleClose = () => {    
        
        setSnackMensaje({
          ...snackMensaje,
          open:false
      });
    
    }
    let color='';
    let textoColor='';
    
    if(estado==='success'){
        color = 'green';
        textoColor='white'
    }else if(estado==='warning'){
        color = 'yellow'
        textoColor='black'
    }else if(estado==='error'){
        color = 'red'
        textoColor='white'
    }else if(estado==='info'){
       color=''

    }

  return (
  
<Snackbar open={open} autoHideDuration={hiddenTime}  onClose={handleClose}  anchorOrigin={{ vertical:'bottom', horizontal:'right' }}>
    <Alert  onClose={handleClose} variant="filled" severity={estado} sx={{fontSize:20, width: '100%', backgroundColor:color, color:textoColor, fontWeight:'bold',}}
     iconMapping={{
        success: <CheckCircleIcon fontSize="large"/>,
        error: <ErrorIcon fontSize="large" />,
        info: <InfoIcon fontSize="large" />,
        warning: <WarningIcon fontSize="large" />,
      }}
    >
    {mensaje}
    </Alert>
</Snackbar>

  )
}
