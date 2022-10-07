import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Grid } from '@mui/material';

// project imports

import ProfileSection from './ProfileSection';


// assets
import { IconMenu2 } from '@tabler/icons';

import logoEscuela from 'assets/images/logoEscuela.png';
import banerJeonsa from 'assets/images/banerjeonsa.png';
import { getDatosEscuela } from 'helpers/escuela';
import { useQuery } from 'react-query';
import { useEffect } from 'react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
   // const state= useSelector(state=>state.reducerUser.userData)
    const { data: datosEscuela, isLoading: isLoadingdatosEscuela } = useQuery(['getDatosEscuela', localStorage.getItem('rut_session')], () =>
    getDatosEscuela(localStorage.getItem('rut_session'))
    );
    useEffect(() => {
        if (!isLoadingdatosEscuela) {
            if (datosEscuela.data===false) {
                localStorage.removeItem('id_escuela');
            }else{
             localStorage.setItem('id_escuela',datosEscuela.data.id)
            }
            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingdatosEscuela])
    
    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                   <Grid container spacing={0}>
                        <Grid item md={12}>
                        <img src={banerJeonsa} alt="APPS GOBM" width="180"/>
                        </Grid>
                   </Grid>
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>

            {/* header search */}
            {/* <SearchSection /> */}
            <Box sx={{ flexGrow:0.03 }} />
            <Box component="span"  sx={{display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                {
                    !isLoadingdatosEscuela?
                    <h3>Panel de administración  {datosEscuela.data===false?"":`para la escuela ${datosEscuela.data.nom}`} </h3>:
                    <h3>Panel de administración </h3>
                }
            </Box>
            
            {/* notification & profile */}

            <ProfileSection />
           
             <Box ml={2}>
                 <img src={logoEscuela} alt="APPS GOBM" width="50"/>
             </Box>
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
