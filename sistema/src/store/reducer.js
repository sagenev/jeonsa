import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import {reducerUser} from './user/userReducer'

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,reducerUser
});

export default reducer;
