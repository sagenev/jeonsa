import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AddBoxIcon from '@mui/icons-material/AddBox';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const menuAdmin = {
    id: 'menuAdmin',
    title: 'Menú Administrador',
    type: 'groupAdmin',
    children: [
        // {
        //     id: 'escuelas',
        //     title: 'Escuelas',
        //     type: 'collapse',
        //     icon: SchoolIcon,
        //     breadcrumbs: false,
        //     children: [
        //         {
        //             id: 'miEscuela',
        //             title: 'Mi escuela',
        //             type: 'item',
        //             url: '/miEscuela',
        //             breadcrumbs: false,
        //             icon: SchoolIcon,
        //         },
        //         {
        //             id: 'agregarEscuela',
        //             title: 'Agregar escuela',
        //             type: 'item',
        //             url: '/agregarEscuela',
        //             breadcrumbs: false,
        //             icon: AddBusinessIcon,
        //         },
        //         {
        //             id: 'administrarEscuelas',
        //             title: 'Adminsitrar escuelas',
        //             type: 'item',
        //             url: '/administrarEscuelas',
        //             breadcrumbs: false,
        //             icon: SettingsIcon,
        //         },
         
        //     ]
        // },
        // {
        //     id: 'alumnos',
        //     title: 'Alumnos',
        //     type: 'collapse',
        //     icon: PeopleAltIcon,
        //     breadcrumbs: false,
        //     children: [
        //         {
        //             id: 'agregarAlumno',
        //             title: 'Agregar alumno',
        //             type: 'item',
        //             url: '/agregarAlumno',
        //             breadcrumbs: false,
        //             icon: PersonAddIcon,
        //         },
        //         {
        //             id: 'AdministrarEscuela',
        //             title: 'Administrar alumnos',
        //             type: 'item',
        //             url: '/ingresoAvance',
        //             breadcrumbs: false,
        //             icon: SettingsIcon,
        //         },
         
        //     ]
        // },
        {
            id: 'campeonatos',
            title: 'Campeonatos',
            type: 'collapse',
            icon: EmojiEventsIcon,
            breadcrumbs: false,
            children: [
                {
                    id: 'crearCampeonato',
                    title: 'Crear campeonato',
                    type: 'item',
                    url: '/crearCampeonato',
                    breadcrumbs: false,
                    icon: AddBoxIcon,
                },
                // {
                //     id: 'misCampeonatos',
                //     title: 'Mis campeonatos',
                //     type: 'item',
                //     url: '/misCampeonatos',
                //     breadcrumbs: false,
                //     icon: MilitaryTechIcon,
                // },
                // {
                //     id: 'inscripciones',
                //     title: 'Inscripciones',
                //     type: 'item',
                //     url: '/inscripciones',
                //     breadcrumbs: false,
                //     icon: EventAvailableIcon,
                // },
                // {
                //     id: 'administrarCampeonatos',
                //     title: 'Administrar campeonato',
                //     type: 'item',
                //     url: '/administrarCampeonato',
                //     breadcrumbs: false,
                //     icon: SettingsIcon,
                // },
         
            ]
        }
    ]
};



export default menuAdmin;
