import { SET_INVITES } from '../actions/invitesAction';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_INVITES:
      return {
        ...state,
        list: action.list,
      };
      break;
    default:
      return state;
  }
}
