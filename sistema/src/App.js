import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CircularProgress, CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { askForPermiso, askForSession } from 'helpers/login';
import { useQuery } from 'react-query';
// import { io } from 'socket.io-client';
// import { useEffect, useState } from 'react';

// ==============================|| APP ||============================== //

const App = () => {
    const {data,isLoading} = useQuery('askSesion',()=>askForSession());
    const {data:dataPer,isLoading:isLoadingPer} = useQuery(['askPermiso',localStorage.getItem('rut_session')], ()=>askForPermiso(localStorage.getItem('rut_session')));


    
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    {!isLoading && !isLoadingPer? <Routes data={data.data} dataPer={dataPer.data}/>:<CircularProgress/>}                
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
