import { combineReducers } from 'redux';
import userReducer from './userReducer';
import evaluationReducer from './evaluationReducer';
import organizationReducer from './organizationReducer';
import storage from 'redux-persist/lib/storage';

const appReducer = combineReducers({
  user: userReducer,
  evaluation: evaluationReducer,
  organization: organizationReducer,
})

export const rootReducer = (state, action) => {
  if(action.type === 'USER_LOGOUT') {
    storage.removeItem('persist:root');
    state = undefined;
  }

  return appReducer(state, action);
}
