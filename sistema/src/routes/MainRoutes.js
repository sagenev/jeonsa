import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import {Inicio} from 'views/inicio/Inicio';
import { Programacion } from 'views/programacion/Programacion';

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/berry/',
            element: <Inicio />
        },    
        {
            path: '/programacion/',
            element: <Programacion />
        }, 
    ]
};

export default MainRoutes;
