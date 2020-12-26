import { SET_INVITES, SET_HAS_NEW } from '../actions/invitesAction';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_INVITES:
      return {
        ...state,
        list: action.list,
      };
      break;
    case SET_HAS_NEW:
      return {
        ...state,
        hasNew: action.bool,
      }
    default:
      return state;
  }
}
