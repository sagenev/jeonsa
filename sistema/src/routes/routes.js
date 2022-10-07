
import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { Navigate } from 'react-router';
import MainLayout from 'layout/MainLayout';
import { Inicio } from 'views/inicio/Inicio';
import { AgregarEscuela } from 'views/escuela/AgregarEscuela';
import { MisAlumnos } from 'views/alumnos/MisAlumnos';
import { CrearCampeonato } from 'views/campeonatos/CrearCampeonato';
import { Inscripciones } from 'views/campeonatos/inscripciones/Inscripciones';
import SignIn from 'views/SignIn';


// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

const routes =(tieneSession,permiso)=>[    
  
    {
        path: '/',
        element: tieneSession===2 ? <MinimalLayout /> : <Navigate to='inicio'/>,  
        children: [
            {
                path: '/',
                element: <AuthLogin3 />
            },
            {
                path: '/registrarse',
                element: <AuthRegister3/>
            },
            {
                path: '/registroSeminario',
                element: <SignIn/>
            }
        ]
    },
    {
        path: '/',
        element: tieneSession ===1 ? <MainLayout />:<Navigate to='/jeonsa/sistemaJeonsa'/>,
        // element: <MainLayout />,
        // ADME2Z2V adm  INSzNjk9 usr
        children: [
            {
                path: '/inicio',
                element: <Inicio />
            },
            {
                path: '/administrarEscuela',
                element: <AgregarEscuela />
            },
            {
                path: '/misAlumnos',
                element: <MisAlumnos />
            },
            {
                path: '/crearCampeonato',
                element: permiso==='ADME2Z2V'? <CrearCampeonato />:<Navigate to='/jeonsa/sistemaJeonsa'/>
            },
            {
                path: '/inscripciones',
                element: <Inscripciones />
            },
           
              
        ]
    }
]  

export default routes;