import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

export default function AlertClose({defaultOpen=false,mensaje="",severity="error",variant="filled"}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (defaultOpen===true) {
        setOpen(true)
    }
  }, [defaultOpen])
  
  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
        severity={severity}
        variant={variant}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {mensaje}
        </Alert>
      </Collapse>
    </Box>
  );
}