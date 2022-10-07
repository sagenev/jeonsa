import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { eliminarEquipo, getParticipantesByIdCampeonato } from 'helpers/user';
import { useQuery, useQueryClient } from 'react-query';
import { useEffect, useState,Fragment } from 'react';
import moment from 'moment';
import { Button, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertDialogDelete from 'components/theme/AlertDialogDelete';
import { SnackComponent } from 'components/theme/SnackComponent';

function Row(props) {
    const { row,openModal,setOpenModal } = props;
    const [open, setOpen] = React.useState(false);

    const abrirModalSetearId=(idEquipo)=>{
        setOpenModal({openModalState:true,deleteElement:false,idToDelete:idEquipo})
    }
    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} style={{ backgroundColor: '#E0D6FF' }} m={1}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.nomEquipo}
                </TableCell>
                <TableCell align="right">{row.cat}</TableCell>
                <TableCell align="right">{row.subCat}</TableCell>
                <TableCell align="right">{row.catEdad}</TableCell>
                <TableCell align="right">{row.rangoGrados}</TableCell>
                <TableCell align="center">
                    <Tooltip title="Eliminar equipo" placement="right-start">
                        <Button variant="contained" size="small" aria-label="delete" color="error" onClick={()=>abrirModalSetearId(row.idEquipo)} >
                            <DeleteIcon/>
                        </Button>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#F4F6F4' }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="subtitle2" gutterBottom component="div">
                                Este equipo fue inscrito el {moment(row.fecInsc).format('DD-MM-YYYY')} a las{' '}
                                {moment(row.fecInsc).format('HH:mm')}
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                Miembros del equipo
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Grado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.alumnos.map((alumno) => (
                                        <TableRow key={alumno.fkAlumno}>
                                            <TableCell component="th" scope="row">
                                                {alumno.nom} {alumno.apeP} {alumno.apeM} {alumno.tip === '1' ? '' : '(SUPLENTE)'}
                                            </TableCell>
                                            <TableCell>{alumno.grado}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function ListadoEquipos({ idCampeonato }) {
    // usquery que trae el listado de todos los alumnos
    const datos = { idCampeonato, rutInstructor: localStorage.getItem('rut_session') };
    const { data, isLoading } = useQuery(['getParticipantesByIdCampeonato', datos], () => getParticipantesByIdCampeonato(datos));
    const [dataForTable, setdataForTable] = useState([]);
    const [openModal, setOpenModal] = useState({openModalState:false,deleteElement:false,idToDelete:0});
    const queryClient = useQueryClient();
    const [textDeleteDialog, settextDeleteDialog] = useState({
        textTitle:'¿Eliminar equipo del campeonato?',
        textBody:'Esta acción eliminará al equipo y sus miembros del campeonato (esto afectará solo a la categoría seleccionada, no afectará a otros equipos que contengan a los mismos miembros).'
    })
    const [snackMensaje, setSnackMensaje] = useState({
        open: false,
        mensaje: '',
        estado: 'success',
        hiddenTime: 2000
    })

    // const [setCloseModal, setsetCloseModal] = useState(second)

    useEffect(() => {
        if (openModal.deleteElement) {
            eliminarEquipo(openModal.idToDelete).then(res=>{
                queryClient.invalidateQueries('getParticipantesByIdCampeonato');
                setOpenModal({openModalState:false,deleteElement:false,idToDelete:0});
                setSnackMensaje({
                    ...snackMensaje,
                    open: true,
                    mensaje: 'Equipo eliminado correctamente del campeonato',
                    estado: 'success',
                    hiddenTime: 3500
                });
            })
            

        }
    }, [openModal])
    

    useEffect(() => {
        if (!isLoading) {
            // recibo la data y debo separarla por equipos
            const datos = data.data;

            // esta constante tendrá un array con todos los id de equipos existentes
            const datosSoloId = datos.map((dat) => dat.id_equipo);

            // aquí filtro de todo el array de id elimino los duplicados
            const idFiltrados = datosSoloId.filter((item, index) => datosSoloId.indexOf(item) === index);

            // en esta constante guardaré los equipos
            const equipos = [];
            for (let i = 0; i < idFiltrados.length; i += 1) {
                const equipo = datos.filter((dat) => dat.id_equipo === idFiltrados[i]);
                equipos.push(equipo);
            }

            // aquí crearé la data que debo cargar en la tabla, con la estructura necesaria
            const dataForTable = [];
            for (let i = 0; i < equipos.length; i += 1) {
                const alumnos = [];

                for (let e = 0; e < equipos[i].length; e += 1) {
                    alumnos.push({
                        nom: equipos[i][e].nom_usu,
                        apeP: equipos[i][e].ape_p,
                        apeM: equipos[i][e].ape_m,
                        grado: equipos[i][e].nom_grado,
                        fkAlumno: equipos[i][e].fk_alumno,
                        tip: equipos[i][e].tip_participante
                    });
                }

                const cabecera = {
                    idEquipo: equipos[i][0].id_equipo,
                    nomEquipo: `Equipo n° ${equipos[i][0].id_equipo}`,
                    cat: equipos[i][0].nom_cat,
                    subCat: equipos[i][0].nom_subCat,
                    catEdad: equipos[i][0].nom_cat_edad,
                    rangoGrados: equipos[i][0].nom_sub_grado,
                    fecInsc: equipos[i][0].fec_insc,
                    alumnos
                };

                dataForTable.push(cabecera);
            }
            setdataForTable(dataForTable);
        }
    }, [data, isLoading]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Equipo</TableCell>
                            <TableCell align="right">Categoría comp.</TableCell>
                            <TableCell align="right">Sub Categoría</TableCell>
                            <TableCell align="right">Categoría edad</TableCell>
                            <TableCell align="right">Rango grados</TableCell>
                            <TableCell align="right">Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataForTable.map((row) => (
                            <Row key={row.idEquipo} row={row} openModal={openModal} setOpenModal={setOpenModal} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AlertDialogDelete openModal={openModal} setOpenModal={openModal} setCloseModal={setOpenModal} title={textDeleteDialog.textTitle} textBody={textDeleteDialog.textBody} />
            <SnackComponent snackMensaje={snackMensaje} setSnackMensaje={setSnackMensaje} />
        </>
    );
}
