// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Avatar,  
 //   Divider,
//    Grid,
    List,
    ListItem,
    ListItemAvatar,     
    ListItemText,  
    Typography
} from '@mui/material';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
// import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';
// import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { memo } from 'react';
// import moment from 'moment';

const ListItemWrapper = styled('div')(() => ({  
    padding: 15,
    '& .MuiListItem-root': {
        padding: 0
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = memo(() => {
    const theme = useTheme();      
     
    // const mostrarNotifica=()=>       
    //   (
    //        <>
    //        {
    //        data.data.length>0 ?
    //         data.data.map(res=>{  

       
    //            return(
    //          <div key={res.id}>

    //             <ListItemWrapper >
    //             <ListItem alignItems="center">
    //             <ListItemAvatar>
    //                     <Avatar
    //                         sx={{
    //                             color,
    //                             backgroundColor,
    //                             border: 'none',
    //                             borderColor
    //                         }}
    //                     >
    //                       {icono}
                        
    //                     </Avatar>
    //                 </ListItemAvatar>
    //                 <ListItemText primary={emisor} />                  
    //             </ListItem>
    //             <Grid container direction="row" className="list-container">
    //                 <Grid item xs={12} sx={{ pb: 1 }}>  
    //                 <Typography mt={-2} variant="caption" display="block" gutterBottom >
    //                                 {moment(tiempoTranscurridoNoti).fromNow()}
    //                     </Typography>                 
    //                     <Typography variant="subtitle2">{res.mensaje} {fecHoraPedido}</Typography>                      
    //                     <Typography variant="subtitle2">{folio} {guia}</Typography>
                       
                                                
    //                 </Grid>
    //             </Grid> 
    //         </ListItemWrapper>
    //         <Divider />
    //         </div>
    //            )
    //        })
    //        :
    //        <ListItemWrapper >
    //        <ListItem alignItems="center">
    //        <ListItemAvatar>
    //                <Avatar
    //                    sx={{
    //                     color : theme.palette.success.dark,
    //                     backgroundColor : theme.palette.success.light,             
    //                     borderColor : theme.palette.success.main,                        
    //                     border: 'none',
                         
    //                    }}
    //                >
    //                <MarkChatUnreadIcon stroke={1.5} size="1.3rem" />                   
    //                </Avatar>
    //            </ListItemAvatar>
    //            <ListItemText primary="No tiene notificaciones" />  
    //        </ListItem>

    //    </ListItemWrapper>
       
    //     }
    //     </>
    //     )
    

    return (
       
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 7
                }
            }}
        >
                         <ListItemWrapper >
           <ListItem alignItems="center">
           <ListItemAvatar>
                   <Avatar
                       sx={{
                        color : theme.palette.success.dark,
                        backgroundColor : theme.palette.success.light,             
                        borderColor : theme.palette.success.main,                        
                        border: 'none',
                         
                       }}
                   >
                   <MarkChatUnreadIcon stroke={1.5} size="1.3rem" />                   
                   </Avatar>
               </ListItemAvatar>
               <ListItemText primary="No tiene notificaciones" />  
           </ListItem>

       </ListItemWrapper>

        </List>

      
    );
});

export default NotificationList;
