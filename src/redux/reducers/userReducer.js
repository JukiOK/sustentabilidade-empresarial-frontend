import { SET_USER, REMOVE_USER } from '../actions/userAction';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        userInfo: action.user,
      }
      break;
    case REMOVE_USER:
      return {
        ...state,
        userInfo: {}
      }
      break;
    default:
      return state;

  }
}
