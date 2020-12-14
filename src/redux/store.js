import { createStore } from 'redux';
import { rootReducer } from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: [''],
};

const pReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(pReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const persistor = persistStore(store);
