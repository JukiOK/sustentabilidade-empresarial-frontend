import { SET_USER } from '../actions/userAction';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        userInfo: action.user,
      }
      break;
    default:
      return state;

  }
}
