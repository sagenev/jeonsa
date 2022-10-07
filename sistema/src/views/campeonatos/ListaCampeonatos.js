import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Paper, Popper, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { eliminarCampeonato, getCampeonatos } from 'helpers/user';
import { useQuery, useQueryClient } from 'react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { memo, useEffect, useRef, useState } from 'react';
import { SnackComponent } from 'components/theme/SnackComponent';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import PropTypes from 'prop-types';

function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

const GridCellExpand = memo((props) => {
    const { width, value } = props;
    const wrapper = useRef(null);
    const cellDiv = useRef(null);
    const cellValue = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showFullCell, setShowFullCell] = useState(false);
    const [showPopper, setShowPopper] = useState(false);

    const handleMouseEnter = () => {
        const isCurrentlyOverflown = isOverflown(cellValue.current);
        setShowPopper(isCurrentlyOverflown);
        setAnchorEl(cellDiv.current);
        setShowFullCell(true);
    };

    const handleMouseLeave = () => {
        setShowFullCell(false);
    };

    useEffect(() => {
        if (!showFullCell) {
            return undefined;
        }

        function handleKeyDown(nativeEvent) {
            // IE11, Edge (prior to using Bink?) use 'Esc'
            if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
                setShowFullCell(false);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setShowFullCell, showFullCell]);

    return (
        <Box
            ref={wrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                alignItems: 'center',
                lineHeight: '24px',
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                zIndex: 60
            }}
        >
            <Box
                ref={cellDiv}
                sx={{
                    height: '100%',
                    width,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    zIndex: 60
                }}
            />
            <Box ref={cellValue} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value}
            </Box>
            {showPopper && (
                <Popper
                    open={showFullCell && anchorEl !== null}
                    anchorEl={anchorEl}
                    style={{ width: wrapper.current.width, zIndex: 10000 }}
                >
                    <Paper
                        elevation={1}
                        // style={{ minHeight: wrapper.current.offsetHeight - 3 }}
                        style={{ height: wrapper.current.height }}
                    >
                        <Typography variant="body2" style={{ padding: 8, textAlign: 'justify', backgroundColor: '#F0F0F0' }}>
                            {value}
                        </Typography>
                    </Paper>
                </Popper>
            )}
        </Box>
    );
});

GridCellExpand.propTypes = {
    value: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired
};

function renderCellExpand(params) {
    return <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />;
}

renderCellExpand.propTypes = {
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: PropTypes.object.isRequired,
    /**
     * The cell value, but if the column has valueGetter, use getValue.
     */
    value: PropTypes.string
};

// ++++++++++ necesario para hacer el expand de la celda, copiado textual de la documentación  FIN +++++++++++++

export default function ListaCampeonatos({ sethayQueEditar }) {
    const queryClient = useQueryClient();
    const [snackMensaje, setSnackMensaje] = useState({
        open: false,
        mensaje: '',
        estado: 'success',
        hiddenTime: 2000
    });

    // usquery que trae el listado de todos los alumnos
    const { data: campeonatos, isLoading: isLoadingcampeonatos } = useQuery('getcampeonatos', () =>getCampeonatos());

    // aquí almacenaré el id del alumno que voy a eliminar
    const [idEliminar, setidEliminar] = useState(0);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const verEliminarCampeonato = (idAlumno) => {
        handleClickOpen()
        setidEliminar(idAlumno);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const setEliminarCampeonato =()=>{
        eliminarCampeonato(idEliminar).then(res=>{
            handleClose()
            queryClient.invalidateQueries('getcampeonatos');
            if (res.data) {
                setSnackMensaje({
                    ...snackMensaje,
                    open: true,
                    mensaje: 'Campeonato eliminado correctamente',
                    estado: 'success',
                    hiddenTime: 2000
                });
                sethayQueEditar({ state: false, data: [] })
            }else{
                setSnackMensaje({
                    ...snackMensaje,
                    open: true,
                    mensaje: 'Ups.. algo salió mal, intentalo nuevamente',
                    estado: 'error',
                    hiddenTime: 3500
                });
            }
        })
    }

    const [sortModel, setSortModel] = useState([
        {
          field: 'fec_reg',
          sort: 'desc',
        },
      ]);



    const columns = [
        { field: 'nom', headerName: 'Nombre del campeonato',renderCell: renderCellExpand, minWidth: 200,flex: 1, align: 'center' },
        {
            field: 'est',
            renderCell: renderCellExpand,
            headerName: 'Estado',
            minWidth: 140,
            flex: 1,
            valueGetter: (params) => {
                let estado = '';
                if (moment(params.row.fec_ini_ins)>moment(params.row.fecha_hoy)) {
                    estado = 'No iniciado';
                }else if(moment(params.row.fec_ini_ins)<=moment(params.row.fecha_hoy) && moment(params.row.fec_ter_ins)>=moment(params.row.fecha_hoy)){
                    estado = "Inscripciones abiertas";
                }else if(moment(params.row.fec_ter_ins)<moment(params.row.fecha_hoy) && moment(params.row.fec_inicio)>moment(params.row.fecha_hoy)){
                    estado = "Inscripciones cerradas";
                }else if(params.row.fec_inicio===params.row.fecha_hoy){
                    estado = "En proceso";
                }else if(moment(params.row.fec_inicio)<moment(params.row.fecha_hoy)){
                    estado = "Términado";
                }else{
                    console.log(params.row)
                    estado="todo mal"
                }
                return estado;
            },
            align: 'center'
        },

        {
            field: 'fec_ini_ins',
            headerName: 'Inicio inscripciones',
            flex: 1,
            minWidth: 140,
            valueGetter: (params) => {
                let fecha = '';
                if (params.row.fec_ini_ins === null) {
                    fecha = '';
                } else {
                    fecha = moment(params.row.fec_ini_ins).format('DD-MM-YYYY');
                }

                return fecha;
            },
            align: 'center'
        },
        {
            field: 'fec_ter_ins',
            headerName: 'Término inscripciones',
            minWidth: 140,
            flex: 1,
            valueGetter: (params) => {
                let fecha = '';
                if (params.row.fec_ter_ins === null) {
                    fecha = '';
                } else {
                    fecha = moment(params.row.fec_ter_ins).format('DD-MM-YYYY');
                }

                return fecha;
            },
            align: 'center'
        },
        {
            field: 'fec_inicio',
            headerName: 'Fecha inicio',
            minWidth: 140,
            flex: 1,
            valueGetter: (params) => {
                let fecha = '';
                if (params.row.fec_ini === null) {
                    fecha = '';
                } else {
                    fecha = moment(params.row.fec_inicio).format('DD-MM-YYYY');
                }

                return fecha;
            },
            align: 'center'
        },
        {
            field: 'fec_reg',
            headerName: 'Creada',
            minWidth: 140,
            flex: 1,
            valueGetter: (params) => {
                let fecha = '';
                if (params.row.fec_reg === null) {
                    fecha = '';
                } else {
                    fecha = moment(params.row.fec_reg).format('DD-MM-YYYY HH:mm');
                }

                return fecha;
            },
            align: 'center',
            
        },
        {
            field: 'action',
            headerName: 'Acción',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => {
                let res = '';
                res = (
                    <>
                        <Grid container>
                            

                                {   // 20/08/2022 >= 31/08/2022 && 30/08/2022>=31/08/2022
                                    moment(params.row.fec_ini_ins)>=moment(params.row.fecha_hoy) || moment(params.row.fec_inicio)<=moment(params.row.fecha_hoy)?
                                    <>
                                    <Grid item xs={3} md={3} lg={3}>
                                        <Tooltip title="Editar alumno" placement="left-end">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => sethayQueEditar({ state: true, data: [params.row] })}
                                                color="warning"
                                            >
                                                <EditIcon />
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={3} ml={3}>
                                    <Tooltip title="Eliminar campeonato" placement="right-start">
                                        <Button variant="contained" size="small" onClick={() => verEliminarCampeonato(params.row.id)} color="error">
                                            <DeleteIcon />
                                        </Button>
                                    </Tooltip>
                                    </Grid>
                                    
                                    </>
                                    :
                                    <>
                                    <Grid item xs={3} md={3} lg={3}>
                                        <Tooltip title="Campeonato en curso, no es posible editar" placement="left-end">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                            >
                                                <EditIcon /><DoDisturbAltIcon />
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={3} ml={3}>
                                    <Tooltip title="Campeonato en curso, no es posible eliminar" placement="right-start">
                                        <Button  variant="outlined" size="small">
                                        <DeleteIcon /><DoDisturbAltIcon />
                                        </Button>
                                    </Tooltip>
                                    </Grid>
                                    </>
                                }
                                

                           
                        </Grid>
                    </>
                );
                return res;
            },
            align: 'center'
        }
    ];

    return (
        <Grid container>
            <Grid item xs={12} md={12} lg={12} mb={2} mt={2}>
                <Divider textAlign="left">LISTADO DE CAMPEONATOS</Divider>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
                <Box sx={{ height: 450, width: '100%' }}>
                    <DataGrid
                        rows={!isLoadingcampeonatos ? campeonatos.data : []}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                        sortModel={sortModel}
                        onSortModelChange={(model) => setSortModel(model)}
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>
            </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{fontSize:"20px",color:"black"}}>
          ¿Eliminar Campeonato?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{fontSize:"20px",color:"black"}}>
          Esta acción eliminará de forma permanente este campeonato del sistema, esto afectará las inscripciones realizadas por las escuelas y sus resultados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary">Cancelar</Button>
          <Button variant="contained" onClick={setEliminarCampeonato} color="error">
            Eliminar campeonato
          </Button>
        </DialogActions>
      </Dialog>
      <SnackComponent snackMensaje={snackMensaje} setSnackMensaje={setSnackMensaje} />
        </Grid>
        
    );
}
