import { createStore } from 'redux';
import reducer from './reducer';

import {persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage';

// ==============================|| REDUX - MAIN STORE ||============================== //

const persistConfig ={
    key:'userRepo',
    storage
}

const persisterReducer = persistReducer(persistConfig,reducer)

const store = createStore(
    persisterReducer,
    /* eslint-disable no-underscore-dangle */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

const persister = 'report';

const Persistor = persistStore(store);

export { store, persister,Persistor};
