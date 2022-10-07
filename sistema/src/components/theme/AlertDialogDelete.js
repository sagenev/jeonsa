import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from 'react';
import { List, ListItem, Typography } from '@mui/material';

export default function AlertDialogDelete({openModal, setOpenModal, setCloseModal, title,textBody }) {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
        setCloseModal({openModalState:false,deleteElement:false,idToDelete:0});
    };

    useEffect(() => {
        if (setOpenModal.openModalState === true) {
            setOpen(true);
        }
    }, [setOpenModal]);

    const handleDelete =()=>{
        setCloseModal({...openModal,openModalState:false,deleteElement:true})
        setOpen(false);
    }

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
                <DialogTitle id="alert-dialog-title" style={{fontSize:20}}>{title}</DialogTitle>
                <DialogContent style={{fontSize:15}}>
                    {textBody}                  
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={handleClose}>Cancelar</Button>
                    <Button variant='contained' color="error" onClick={handleDelete}>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
