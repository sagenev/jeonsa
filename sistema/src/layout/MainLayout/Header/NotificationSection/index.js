import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Box,   
    Button,  
    CardActions,     
    ClickAwayListener,
    Divider,
    Grid,
    Paper,
    Popper,     
    useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
// import NotificationList from './NotificationList';

// assets


// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    // const [setValue] = useState('');
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

 

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    // const handleChange = (event) => {
    //     if (event?.target.value) setValue(event?.target.value);
    // };

   const limpiarTodasNotifi=()=>{
    console.log('limpiar')
   }



//    const handleToggle = () => {
   
//     setOpen((prevOpen) => !prevOpen);
// };


    // const mostrarNotificacion=()=>( <Badge badgeContent={1}  color="primary">
    //                 <ButtonBase sx={{ borderRadius: '12px' }}>
    //                     <Avatar
    //                         variant="rounded"
    //                         sx={{
    //                             ...theme.typography.commonAvatar,
    //                             ...theme.typography.mediumAvatar,
    //                             transition: 'all .2s ease-in-out',
    //                             background: orange[800],
    //                             color: theme.palette.warning.light,
    //                             '&[aria-controls="menu-list-grow"],&:hover': {
    //                                 background: orange[600],
    //                                 color: theme.palette.warning.light
    //                             }
    //                         }}
    //                         ref={anchorRef}
    //                         aria-controls={open ? 'menu-list-grow' : undefined}
    //                         aria-haspopup="true"
    //                         onClick={handleToggle}
    //                         color="inherit"
    //                     >
    //                         <IconBell stroke={1.5} size="1.3rem" />
    //                     </Avatar>
    //                 </ButtonBase>
    //                </Badge>)

    return (
        <>

            <Box
                sx={{
                    ml: 2,
                    mr: 3,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                {/* {
                    isLoading ? <CircularProgress/> 
                    : 
           
                   mostrarNotificacion()
                } */}
    
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
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
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Grid container direction="column" spacing={2}>
                                 
                                        <Grid item xs={12}>
                                            <PerfectScrollbar
                                                style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}
                                            >
                                                <Grid container direction="column" spacing={2}>                                      
                                                    <Grid item xs={12} p={0}>
                                                        <Divider sx={{ my: 0 }} />
                                                    </Grid>
                                                </Grid>
                                        {/* <NotificationList  /> */}
                                              
                                            </PerfectScrollbar>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    <CardActions sx={{ p: 1.25, justifyContent: 'right' }}>
                                        <Button size="small" variant="outlined" disableElevation onClick={()=>limpiarTodasNotifi()}>
                                            Limpiar
                                        </Button>
                                    </CardActions>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default NotificationSection;
