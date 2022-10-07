// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const permiso = localStorage.getItem('fec_permiso');
    const navItems = menuItem.items.map((item) => {
        switch (item.type) {
            // case 'groupPlanta':
            //     return per==='3478b9ae-4015-4d48-b477-922761151b02'||per==='ff291ba4-d649-4af5-8bd2-2fd2e7a1c3b4'?<NavGroup key={item.id} item={item} />:null;
            case 'groupUser':
                return permiso==='INSzNjk9'?<NavGroup key={item.id} item={item}/>:null;
            case 'groupAdmin':
                return permiso==='ADME2Z2V'?<NavGroup key={item.id} item={item}/>:null;
          
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
