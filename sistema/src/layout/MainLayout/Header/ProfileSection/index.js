import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Typography
} from '@mui/material';


// third-party
// import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// import User1 from 'assets/images/users/user-round.svg';
import { useNavigate } from 'react-router';
// assets
import { IconLogout, IconSettings } from '@tabler/icons';
import config from 'config';
import { cerrarSesion } from 'helpers/login';



// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const navigate  = useNavigate()
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);



    const [selectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);
    const handleLogout = async () => {
        cerrarSesion().then(()=>{
                    localStorage.removeItem('persist:userRepo')
                    localStorage.removeItem('rut_session');
                    localStorage.removeItem('nom_session');
                    localStorage.removeItem('ape_session');
                    localStorage.removeItem('car_session');
                    localStorage.removeItem('fec_session');
                    localStorage.removeItem('fec_permiso');
             navigate(`${config.basename}`, { state: { approved: true } }) 
             window.location.replace(`${config.basename}`);
            // limpiar las variables de sesión
        }) 
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    // const handleListItemClick = (event, index, route = '') => {
    //     setSelectedIndex(index);
    //     handleClose(event);

    //     if (route && route !== '') {
    //         navigate(route);
    //     }
    // };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const nombrePermiso =(permiso)=>{
        let nom = ''
        if (permiso==='2') {
           nom='Instructor' 
        }else if(permiso==='1'){
            nom='Administrador'
        }

        return nom;
    }



    return (
        <>
         <Card sx={{ minWidth: 100, height:57, padding:0}}>
            <CardContent sx={{ minWidth: 100, height:57, padding:1.5}}>
                <Typography variant="h5" component="div">
                {localStorage.getItem('nom_session').toUpperCase()} {localStorage.getItem('ape_session').toUpperCase()}
                </Typography>
                <Typography color="text.secondary">
                {nombrePermiso(localStorage.getItem('fec_permiso'))}
                </Typography>
            </CardContent>
        </Card>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={

                    <Avatar
                       
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer',
                           
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                       
                    ><PersonIcon/>
                        </Avatar>
                }
                label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    {/* <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography variant="h4">Buen día</Typography>
                                                <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                    Nombre de usuario
                                                </Typography>
                                            </Stack>
                                            <Typography variant="subtitle2">Nombre de Empresa</Typography>
                                        </Stack>
                                    </Box> */}

                                    <Box sx={{ p: 2 }}>
                                        <Divider />
                                        <List
                                            component="nav"
                                            sx={{
                                                width: '100%',
                                                 maxWidth: 100,
                                                 minWidth: 100,
                                                backgroundColor: theme.palette.background.paper,
                                                borderRadius: '10px',
                                                [theme.breakpoints.down('md')]: {
                                                    minWidth: '100%'
                                                },
                                                '& .MuiListItemButton-root': {
                                                    mt: 0.5
                                                }
                                            }}
                                        >
                                            {/* <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 0}
                                                onClick={(event) => handleListItemClick(event, 0, '/user/account-profile/profile1')}
                                            >
                                                <ListItemIcon>
                                                    <IconSettings stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Cuenta</Typography>} />
                                            </ListItemButton> */}
                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 4}
                                                onClick={handleLogout}
                                            >
                                                <ListItemIcon>
                                                    <IconLogout stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Salir</Typography>} />
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
