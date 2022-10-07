import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import SchoolIcon from '@mui/icons-material/School';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useFormik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import { inhabilitarMensajeAyuda, volverMostrar } from 'helpers/user';



export default function MensajeInicio() {
    const state = useSelector((state) => state.reducerUser.userData);

    // usquery que trae de la bd la tabla de status
    const { data: volverMostrarData, isLoading: isLoadingvolverMostrarData } = useQuery(['volverMostrar',state.rut_session], () => volverMostrar(state.rut_session));
    const [noVolverMostrar, setnoVolverMostrar] = React.useState({estado:false,texto:'¡Entendido!'})

    const { mutate } = useMutation(inhabilitarMensajeAyuda, {
        onSuccess: (res) => {
            console.log(res)
        }
    });

    const formik = useFormik({
        initialValues:{
            isChecked:false
        },
        onSubmit:()=>{
          mutate(state.rut_session)
        },
    })


    
    
    const [open, setOpen] = React.useState(false);


    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (formik.values.isChecked===true) {// no quiere volver a verlo
            setnoVolverMostrar({
                estado:true,
                texto:'Click aquí y no lo volveré a mostrar'
            })
        }else{
            setnoVolverMostrar({
                estado:false,
                texto:'¡Entendido!'
            })
        }
    }, [formik.values.isChecked])

    useEffect(() => {
        if (!isLoadingvolverMostrarData) {
            if (volverMostrarData.data===true) {
                setOpen(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingvolverMostrarData])
    

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
                <DialogTitle id="alert-dialog-title" style={{ fontSize: '17px', color: '#63034A' }}>
                    {state.nom_session}, bienvenido/a al sistema de adminsitración para campeonatos JEON-SA
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={0}>
                        <Grid item sm={12} xs={12} md={12} lg={12}>
                            <Typography variant="body1" style={{ color: '#050505' }} gutterBottom component="div">
                                Notamos que tal vez eres nuevo y nos gustaría
                                darte algunos consejos para empezar.
                            </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12} md={12} lg={12} mt={1}>
                            <Typography style={{ fontSize: '17px', color: '#63034A' }} variant="subtitle1" gutterBottom component="div">
                                ¡Primero, crea tu escuela!
                            </Typography>
                            <Typography variant="body1" style={{ color: '#050505' }} gutterBottom component="div">
                                Esto es primordial para poder interactuar con el resto del sistema, si aún no has creado y registrado tu
                                escuela, esto es lo primero que te recomendamos hacer, solo tienes que ir al menú izquierdo y busca el
                                siguiente icono <SchoolIcon /> (Mi escuela) luego en el menú que se despliega busca este icono{' '}
                                <AddBusinessIcon />
                                (Agregar escuela) sigue los pasos del formulario para registrar tu escuela.
                            </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12} md={12} lg={12} mt={1}>
                            <Typography style={{ fontSize: '17px', color: '#63034A' }} variant="subtitle1" gutterBottom component="div">
                                ¡Segundo, registra a tus alumnos!
                            </Typography>
                            <Typography variant="body1" style={{ color: '#050505' }} gutterBottom component="div">
                                ¿Ya registraste tu escuela?, ahora puedes registrar a los alumnos que asisten a ella y esto es lo que te
                                recomendamos hacer ahora. Para esto solo tienes que ir al menú izquierdo en busca del siguiente icono{' '}
                                <PeopleAltIcon />
                                (Mis alumnos) una vez se despliegue el menú debes buscar este icono <PersonAddIcon />
                                (Agregar alumno) este te llevará al formulario donde podrás registrar uno por uno a todos tus alumnos.
                            </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12} md={12} lg={12} mt={1}>
                            <Typography style={{ fontSize: '17px', color: '#63034A' }} variant="subtitle1" gutterBottom component="div">
                                ¡Ya puedes registrarte en un campeonato!
                            </Typography>
                            <Typography variant="body1" style={{ color: '#050505' }} gutterBottom component="div">
                                ¿Está lista tu escuela y tus alumnos?, entonces ya puedes inscribir a tu escuela en alguno de nuestros
                                campeonatos, ¿fácil no?, para esto solo debes ir al menú lateral izquierdo en busca de este incono
                                <EmojiEventsIcon />
                                (Campeonatos) y luego en el menú que se despliega debes hacer click en el icono <EventAvailableIcon />
                                (Inscripciones) una vez en el formulario solo sigue los pasos indicados ahí para completar tu inscripción,
                                recuerda que los pasos anteriores son excluyentes para poder realizar una inscripción satisfactoria.
                            </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12} md={12} lg={12} mt={1}>
                            <Typography style={{ fontSize: '17px', color: '#63034A' }} variant="body2" gutterBottom component="div">
                                Es importante recalcar que el primer y segundo caso solo es necesario hacerlos la primera vez, luego para
                                futuros campeonatos podrás usar tu escuela y alumnos previamente registrados y solo editar los datos que
                                necesites actualizar.
                            </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12} md={12} lg={12} mt={1}>
                            <Typography style={{ fontSize: '14px', color: '#63034A' }} variant="inherit" gutterBottom component="div">
                                Es por esta razón que te pedimos realizar los pasos de la mejor manera posible y sin apuros, para que tu
                                experiencia con nuestro sistema sea la mejor posible.
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <FormGroup>
                        <FormControlLabel control={
                                        <Checkbox
                                            checked={formik.values.isChecked}
                                            onChange={formik.handleChange}
                                            name="isChecked"
                                            color="primary"
                                        />

                                    } label="No volver a mostrar" />
                    </FormGroup>
                    <form onSubmit={formik.handleSubmit}>
                    <Button style={{textTransform: 'none'}} variant="contained" type="submit" color="secondary" onClick={handleClose}>
                        {noVolverMostrar.estado?noVolverMostrar.texto:noVolverMostrar.texto}
                    </Button>
                    </form>
                </DialogActions>
            </Dialog>
        </div>
    );
}
