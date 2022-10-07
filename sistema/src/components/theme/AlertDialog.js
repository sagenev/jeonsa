import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from 'react';
import { List, ListItem, Typography } from '@mui/material';

export default function AlertDialog({ setOpenModal = false, setCloseModal }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCloseModal(false);
    };

    useEffect(() => {
        if (setOpenModal === true) {
            handleClickOpen();
        }
    }, [setOpenModal]);

    return (
        <div>
            <Dialog
                maxWidth="sm"
                fullWidth
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Términos y condiciones de uso de nuestro sistema</DialogTitle>
                <DialogContent>

                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <ListItem>
                                <Typography>
                                -El incumplimiento de cualquiera de las condiciones establecidas a continuación puede provocar la eliminación de la cuenta del usuario junto con la información de su escuela, alumnos y campeonatos.
                                </Typography>
                            </ListItem>
                            <ListItem>
                            <Typography>
                                -El mal uso del sistema como el ingreso de información falsa, insultante o que pueda afectar y/o molestar a otros usuarios será tomado como un incumplimiento.
                                </Typography>
                            </ListItem>
                            <ListItem>
                            <Typography>
                                -El sistema es para uso ESTRICTO de los instructores de las escuelas, NO deben registrarse en este formulario los alumnos o apoderados, ingresar a los alumnos al sistema es tarea del/la instructor/a responsable, el/ella los podrá registrar luego de que se haya registrado e ingresado al sistema con sus credenciales.
                                </Typography>
                            </ListItem>
                        </List>
                  
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={handleClose}>Entendido</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
