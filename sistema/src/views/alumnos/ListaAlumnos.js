import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Tooltip } from '@mui/material';
import moment from 'moment';
import { eliminarAlumno, getAlumnos, getCategorias } from 'helpers/user';
import { useQuery, useQueryClient } from 'react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState,useRef,useEffect,memo } from 'react';
import { SnackComponent } from 'components/theme/SnackComponent';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';

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

export default function ListaAlumnos({ sethayQueEditar }) {
    const queryClient = useQueryClient();
    const [snackMensaje, setSnackMensaje] = useState({
        open: false,
        mensaje: '',
        estado: 'success',
        hiddenTime: 2000
    });
    // usquery que trae el listado de todos los alumnos
    const { data: alumnos, isLoading: isLoadingalumnos } = useQuery(['getAlumnos', localStorage.getItem('rut_session')], () =>
        getAlumnos(localStorage.getItem('rut_session'))
    );

    const { data: categorias, isLoading: isLoadingcategorias } = useQuery('getcategorias', () =>getCategorias());

    // aquí almacenaré el id del alumno que voy a eliminar
    const [idEliminar, setidEliminar] = useState(0);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const verEliminarAlumno = (idAlumno) => {
        handleClickOpen()
        setidEliminar(idAlumno);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const setEliminarAlumno =()=>{
        eliminarAlumno(idEliminar).then(res=>{
            handleClose()
            queryClient.invalidateQueries('getAlumnos');
            if (res.data) {
                setSnackMensaje({
                    ...snackMensaje,
                    open: true,
                    mensaje: 'Alumno eliminado correctamente',
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


    const columns = [
        { field: 'rut', headerName: 'Rut', minWidth: 120, align: 'center' },
        {
            field: 'fullName',
            headerName: 'Nombre',
            sortable: false,
            flex: 1,
            minWidth: 130,
            renderCell: renderCellExpand,
            valueGetter: (params) => `${params.row.nom || ''} ${params.row.ape_p || ''} ${params.row.ape_m || ''}`
        },
        { field: 'sex', headerName: 'Sexo', minWidth: 100, align: 'center' },
        { field: 'nom_gra', headerName: 'Grado', minWidth: 200, align: 'center' },
        {
            field: 'fec_nac',
            headerName: 'Fecha nacimiento',
            minWidth: 140,
            valueGetter: (params) => {
                let fecha = '';
                if (params.row.fec_nac === null) {
                    fecha = '';
                } else {
                    fecha = moment(params.row.fec_nac).format('DD-MM-YYYY');
                }

                return fecha;
            },
            align: 'center'
        },
        { field: 'cat', headerName: 'Categoría', minWidth: 100, align: 'center' },
        {
            field: 'tip_usu',
            headerName: 'Tipo',
            minWidth: 100,
            valueGetter: (params) => {
                let tipo = '';
                if (params.row.tip_usu === '2') {
                    tipo = 'Alumno';
                } else if (params.row.tip_usu === '1') {
                    tipo = 'Instructor';
                }

                return tipo;
            },
            align: 'center'
        },
        {
            field: 'action',
            headerName: 'Acción',
            minWidth: 200,
            renderCell: (params) => {
                let res = '';
                res = (
                    <>
                        <Grid container>
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
                            {
                                params.row.tip_usu==="2"?
                                <Grid item xs={3} md={3} lg={3} ml={3}>
                                <Tooltip title="Eliminar alumno" placement="right-start">
                                    <Button variant="contained" size="small" onClick={() => verEliminarAlumno(params.row.id)} color="error">
                                        <DeleteIcon />
                                    </Button>
                                </Tooltip>
                                </Grid>
                                :
                                null
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
                <Divider textAlign="left">LISTADO DE ALUMNOS</Divider>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={!isLoadingalumnos ? alumnos.data : []}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
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
          ¿Eliminar alumno?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{fontSize:"20px",color:"black"}}>
          Esta acción eliminará de forma permanente la información de este alumno, ¿Desea continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary">Cancelar</Button>
          <Button variant="contained" onClick={setEliminarAlumno} color="error">
            Eliminar alumno
          </Button>
        </DialogActions>
      </Dialog>
      <SnackComponent snackMensaje={snackMensaje} setSnackMensaje={setSnackMensaje} />
        </Grid>
        
    );
}
