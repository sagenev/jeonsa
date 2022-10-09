import { FilePresent } from '@mui/icons-material';
import { Button, Divider, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { FieldArray, Form, Formik } from 'formik';
import { getParticipantes, getSubCategoriasInscripciones, guardarInscripcion } from 'helpers/user';
import { useState } from 'react';
import { AlumnoTextField } from './AlumnoTextField';
import * as yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import { llamadaApi } from 'api/reqApi';
import { SnackComponent } from 'components/theme/SnackComponent';
import ListadoEquipos from './ListadoEquipos';
import AlertClose from 'components/theme/AlertClose';
import moment from 'moment'

// validaciones del formulario
const validar = yup.object().shape({
    // campeonato
    campeonato: yup.string().required('Campo requerido'),
    cat: yup.string().required('Campo requerido'),
    subCat: yup.string().required('Campo requerido'),
    alumnos: yup.array().of(
        yup.object().shape({
            idAlumno: yup
                .string()
                .required('Campo requerido')
                .test(
                    'validarSiestaEnOtraCategoria',
                    'Este participante ya fue inscrito en esta categoría de competencia',
                    async (value, datos) => {
                        // el false activa el error
                        let valida = true;
                        let datosConsulta = { idAlumno: '', idCampeonato: '', idCategoria: '' };
                        if (value) {
                            datosConsulta = {
                                idAlumno: value,
                                idCampeonato: datos.from[1].value.campeonato,
                                idCategoria: datos.from[1].value.cat
                            };
                        }

                        const data = await llamadaApi.post('/controller/controlador', { valAlumnoExisteEnCategoriaActual: datosConsulta });
                        if (data.data.length > 0) {
                            // encontró el registro, este alumno ya está inscrito para este campeonato en esta categoría
                            valida = false;
                        } else {
                            valida = true;
                        }
                        return valida;
                    }
                )
        })
    )
});

export const FormInscripciones = ({ campeonatos, categorias, categoriasAlumnos }) => {
    // el id que evalua si se editará o se guardará el registro
    const [idEditar, setidEditar] = useState('');

    // // este estado me indicará si el formulario ya está en proceso
    const [enProceso, setenProceso] = useState(false);

    // aquí guardo las sub categorías del select
    const [subCategorias, setsubCategorias] = useState([]);

    const [selectedCategoria, setselectedCategoria] = useState(false);

    const [participantes, setparticipantes] = useState([]);

    const [campeonatoSeleccionado, setcampeonatoSeleccionado] = useState({
        fec_ini_ins: '',
        fec_ter_ins: '',
        fec_inicio: ''
    });

    const cancelarProceso = () => {
        setenProceso(false);
        setselectedCategoria(false);
    };

    const queryClient = useQueryClient();
    const [snackMensaje, setSnackMensaje] = useState({
        open: false,
        mensaje: '',
        estado: 'success',
        hiddenTime: 2000
    });

    // para guardar la inscripción
    const { mutate } = useMutation(guardarInscripcion, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('getParticipantesByIdCampeonato');
            if (res.data === 1 || res.data === 2) {
                if (res.data === 1) {
                    setSnackMensaje({
                        ...snackMensaje,
                        open: true,
                        mensaje: 'Equipo inscrito correctamente, puede seguir registrando a sus competidores',
                        estado: 'success',
                        hiddenTime: 3500
                    });
                } else {
                    setSnackMensaje({
                        ...snackMensaje,
                        open: true,
                        mensaje: 'Equipo editado correctamente',
                        estado: 'success'
                    });
                    // sethayQueEditar({state:false,data:[]})
                }
            } else {
                setSnackMensaje({
                    ...snackMensaje,
                    open: true,
                    mensaje: 'Ups.. Hubo un error inesperado, inténtelo nuevamente',
                    estado: 'error',
                    hiddenTime: 3500
                });
            }
        }
    });

    return (
        <Formik
            initialValues={{
                campeonato: '',
                cat: '',
                subCat: '',
                alumnos: [
                    {
                        idAlumno: ''
                    }
                ],
                catAlumno: '',
                rangoGrado: '',
                idEditar
            }}
            validationSchema={validar}
            onSubmit={(values, actions) => {
                mutate(values);
                // limpiaré solo los campos necesarios para continuar un registro detras de otro
                for (let i = 0; i < values.alumnos.length; i += 1) {
                    actions.setFieldValue(`alumnos[${i}].idAlumno`, '');
                }
            }}
        >
            {() => (
                <Form>
                    <FieldArray name="alumnos">
                        {(fieldArrayProps) => {
                            const { push, remove, form } = fieldArrayProps;
                            const { values } = form;
                            const { alumnos } = values;

                            return (
                                <>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6} lg={6}>
                                            <FormControl
                                                fullWidth
                                                size="small"
                                                error={form.touched.campeonato && Boolean(form.errors.campeonato)}
                                            >
                                                <InputLabel>Campeonato</InputLabel>
                                                <Select
                                                    label="Campeonato"
                                                    size="small"
                                                    disabled={enProceso}
                                                    name="campeonato"
                                                    value={form.values.campeonato}
                                                    onBlur={form.handleBlur}
                                                    onChange={(e) => {
                                                        form.setFieldValue('campeonato', e.target.value);
                                                        for (let i = 0; i < campeonatos.length; i += 1) {
                                                            if (campeonatos[i].id === e.target.value) {
                                                                setcampeonatoSeleccionado({
                                                                    fec_ini_ins: campeonatos[i].fec_ini_ins,
                                                                    fec_ter_ins: campeonatos[i].fec_ter_ins,
                                                                    fec_inicio: campeonatos[i].fec_inicio
                                                                });
                                                            }
                                                        }
                                                        // setcampeonatoSeleccionado(campeonatos.map(x => x.id === e.target.value))
                                                        setenProceso(true);
                                                    }}
                                                >
                                                    {campeonatos.map((campeonato) => (
                                                        <MenuItem key={campeonato.id} value={campeonato.id}>
                                                            {campeonato.nom}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{form.touched.campeonato && form.errors.campeonato}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        {enProceso ? (
                                            <Grid item xs={1} md={1} lg={1}>
                                                <Button variant="contained" color="error" onClick={cancelarProceso}>
                                                    Cancelar
                                                </Button>
                                            </Grid>
                                        ) : null}
                                    </Grid>

                                    {enProceso ? (
                                            <>
                                            <Grid container spacing={2} mt={0.1}>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <AlertClose
                                                        defaultOpen
                                                        mensaje={`Término de inscripciones ${moment(campeonatoSeleccionado.fec_ter_ins).format("DD-MM-YYYY")}`}
                                                        severity="info"
                                                        variant="filled"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <AlertClose
                                                        defaultOpen
                                                        mensaje={`Inicio de campeonato ${moment(campeonatoSeleccionado.fec_inicio).format("DD-MM-YYYY")}`}
                                                        severity="info"
                                                        variant="filled"
                                                    />
                                                </Grid>
                                            </Grid>
                                            </>
                                        ) : null}

                                    {enProceso ? (
                                        <>
                                            <Grid container spacing={2} mt={1}>
                                                <Grid item xs={12} md={12} lg={12}>
                                                    <Divider textAlign="left">DATOS PARTICIPANTES</Divider>
                                                </Grid>

                                                <Grid item xs={12} md={3} lg={3}>
                                                    <FormControl
                                                        fullWidth
                                                        size="small"
                                                        error={form.touched.catAlumno && Boolean(form.errors.catAlumno)}
                                                    >
                                                        <InputLabel>Categoría por edad</InputLabel>
                                                        <Select
                                                            label="Categoría por edad"
                                                            size="small"
                                                            name="catAlumno"
                                                            value={form.values.catAlumno}
                                                            onBlur={form.handleBlur}
                                                            onChange={(e) => {
                                                                form.setFieldValue('catAlumno', e.target.value);
                                                                for (let i = 0; i < alumnos.length; i += 1) {
                                                                    form.setFieldValue(`alumnos[${i}].idAlumno`, '');
                                                                }
                                                                getParticipantes({
                                                                    filtroCat: e.target.value,
                                                                    filtroRango: form.values.rangoGrado,
                                                                    rutInstructor: localStorage.getItem('rut_session')
                                                                }).then((res) => {
                                                                    setparticipantes(res.data);
                                                                });
                                                            }}
                                                        >
                                                            {categoriasAlumnos.data.map((categoria) => (
                                                                <MenuItem key={categoria.id} value={categoria.id}>
                                                                    {categoria.nom}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <FormHelperText>{form.touched.catAlumno && form.errors.catAlumno}</FormHelperText>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} md={3} lg={3}>
                                                    <FormControl
                                                        fullWidth
                                                        size="small"
                                                        error={form.touched.rangoGrado && Boolean(form.errors.rangoGrado)}
                                                    >
                                                        <InputLabel>Rango de grados</InputLabel>
                                                        <Select
                                                            label="Rango de grados"
                                                            size="small"
                                                            name="rangoGrado"
                                                            value={form.values.rangoGrado}
                                                            onBlur={form.handleBlur}
                                                            onChange={(e) => {
                                                                form.setFieldValue('rangoGrado', e.target.value);
                                                                for (let i = 0; i < alumnos.length; i += 1) {
                                                                    form.setFieldValue(`alumnos[${i}].idAlumno`, '');
                                                                }
                                                                getParticipantes({
                                                                    filtroCat: form.values.catAlumno,
                                                                    filtroRango: e.target.value,
                                                                    rutInstructor: localStorage.getItem('rut_session')
                                                                }).then((res) => {
                                                                    setparticipantes(res.data);
                                                                });
                                                            }}
                                                        >
                                                            <MenuItem key="1" value="1">
                                                                Principiantes (10mo – 9no gup)
                                                            </MenuItem>
                                                            <MenuItem key="2" value="2">
                                                                Iniciales (8vo – 5to gup)
                                                            </MenuItem>
                                                            <MenuItem key="3" value="3">
                                                                Avanzados (4to – 1er gup)
                                                            </MenuItem>
                                                            <MenuItem key="4" value="4">
                                                                Avanzados ELITE (4to – 1er gup)
                                                            </MenuItem>
                                                            <MenuItem key="5" value="5">
                                                                Experto (DAN)
                                                            </MenuItem>
                                                            <MenuItem key="6" value="6">
                                                                Experto ELITE (DAN Elite)
                                                            </MenuItem>
                                                        </Select>
                                                        <FormHelperText>{form.touched.rangoGrado && form.errors.rangoGrado}</FormHelperText>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} md={3} lg={3}>
                                                    <FormControl
                                                        fullWidth
                                                        size="small"
                                                        error={form.touched.cat && Boolean(form.errors.cat)}
                                                    >
                                                        <InputLabel>Categoría de competencia</InputLabel>
                                                        <Select
                                                            label="Categoría de competencia"
                                                            size="small"
                                                            name="cat"
                                                            value={form.values.cat}
                                                            onBlur={form.handleBlur}
                                                            onChange={(e) => {
                                                                form.setFieldValue('cat', e.target.value);
                                                                form.setFieldValue('subCat', '');

                                                                getSubCategoriasInscripciones(e.target.value).then((res) => {
                                                                    setsubCategorias(res.data);
                                                                });
                                                            }}
                                                        >
                                                            {categorias.data.map((categoria) => (
                                                                <MenuItem key={categoria.id} value={categoria.id}>
                                                                    {categoria.nom}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <FormHelperText>{form.touched.cat && form.errors.cat}</FormHelperText>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} md={3} lg={3}>
                                                    <FormControl
                                                        fullWidth
                                                        size="small"
                                                        error={form.touched.subCat && Boolean(form.errors.subCat)}
                                                    >
                                                        <InputLabel>Sub categoría</InputLabel>
                                                        <Select
                                                            label="Sub categoría"
                                                            size="small"
                                                            name="subCat"
                                                            value={form.values.subCat}
                                                            onBlur={form.handleBlur}
                                                            onChange={(e) => {
                                                                form.setFieldValue('subCat', e.target.value);
                                                                const categoria = subCategorias.filter((cat) => cat.id === e.target.value);
                                                                const cantAlumnos = Number.parseInt(categoria[0].can_per, 10);
                                                                form.setFieldValue('alumnos', []);

                                                                for (let i = 0; i < form.values.alumnos.length; i += 1) {
                                                                    remove(i);
                                                                }

                                                                let valAlumnos = cantAlumnos;
                                                                if (valAlumnos === 5) {
                                                                    valAlumnos = 6;
                                                                }
                                                                for (let i = 0; i < valAlumnos; i += 1) {
                                                                    push({ idAlumno: '' });
                                                                }

                                                                setselectedCategoria(true);
                                                            }}
                                                        >
                                                            {subCategorias.map((subCategoria) => (
                                                                <MenuItem key={subCategoria.id} value={subCategoria.id}>
                                                                    {subCategoria.nom}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <FormHelperText>{form.touched.subCat && form.errors.subCat}</FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : null}
                                    <Grid container spacing={2} mt={2}>
                                        {selectedCategoria
                                            ? alumnos.map((datos, index) => (
                                                  <Grid key={index} item md={6} sm={12} lg={6} xs={12}>
                                                      <AlumnoTextField
                                                          index={index}
                                                          label={
                                                              index === 5 ? `Participante suplente (opcional)` : `Participante ${index + 1}`
                                                          }
                                                          array={participantes}
                                                          name={`alumnos[${index}].idAlumno`}
                                                          formik={form}
                                                      />
                                                  </Grid>
                                              ))
                                            : null}
                                    </Grid>
                                    {selectedCategoria ? (
                                        <Grid container textAlign="center" mt={4}>
                                            <Grid item md={12} xs={12}>
                                                <Button type="submit" variant="contained">
                                                    Guardar
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ) : null}

                                    {enProceso ? (
                                        <>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} md={12} lg={12} mb={2} mt={2}>
                                                    <Divider textAlign="left">
                                                        LISTADO DE TUS EQUIPOS REGISTRADOS EN ESTE CAMPEONATO
                                                    </Divider>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={1} mt={2} style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}>
                                                <Grid item md={12} xs={12} lg={12} m={2}>
                                                    <ListadoEquipos idCampeonato={form.values.campeonato} />
                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : null}
                                </>
                            );
                        }}
                    </FieldArray>
                    <SnackComponent snackMensaje={snackMensaje} setSnackMensaje={setSnackMensaje} />
                </Form>
            )}
        </Formik>
    );
};
