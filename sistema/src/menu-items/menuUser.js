// assets
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const menuUser = {
    id: 'menuUser',
    title: 'Menú Instructor',
    type: 'groupUser',
    children: [
        {
            id: 'miEscuela',
            title: 'Mi escuela',
            type: 'collapse',
            icon: SchoolIcon,
            breadcrumbs: false,
            children: [
                {
                    id: 'administrarEscuela',
                    title: 'Adminsitrar escuela',
                    type: 'item',
                    url: '/administrarEscuela',
                    breadcrumbs: false,
                    icon: SettingsIcon,
                },
         
            ]
        },
        {
            id: 'misAlumnos',
            title: 'Mis alumnos',
            type: 'collapse',
            icon: PeopleAltIcon,
            breadcrumbs: false,
            children: [
                {
                    id: 'agregarAlumno',
                    title: 'Agregar alumno',
                    type: 'item',
                    url: '/misAlumnos',
                    breadcrumbs: false,
                    icon: PersonAddIcon,
                },
                // {
                //     id: 'AdministrarEscuela',
                //     title: 'Administrar alumnos',
                //     type: 'item',
                //     url: '/ingresoAvance',
                //     breadcrumbs: false,
                //     icon: SettingsIcon,
                // },
         
            ]
        },
        {
            id: 'campeonatos',
            title: 'Campeonatos',
            type: 'collapse',
            icon: EmojiEventsIcon,
            breadcrumbs: false,
            children: [
                {
                    id: 'misCampeonatos',
                    title: 'Mis campeonatos',
                    type: 'item',
                    url: '/misCampeonatos',
                    breadcrumbs: false,
                    icon: MilitaryTechIcon,
                },
                {
                    id: 'inscripciones',
                    title: 'Inscripciones',
                    type: 'item',
                    url: '/inscripciones',
                    breadcrumbs: false,
                    icon: EventAvailableIcon,
                },
         
            ]
        }
    ]
};



export default menuUser;
