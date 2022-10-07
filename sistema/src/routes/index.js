import { useRoutes} from 'react-router-dom';

// routes
// import MainRoutes from './MainRoutes';
// import AuthenticationRoutes from './AuthenticationRoutes';
import config from 'config';
import routes from './routes';


// ==============================|| ROUTING RENDER ||============================== //

export default  function ThemeRoutes({data,dataPer}) {

  // console.log(data)
  // console.log(dataPer)
  return  useRoutes(routes(1,dataPer.permiso),config.basename)
  // return  useRoutes(routes(1),config.basename)

}


