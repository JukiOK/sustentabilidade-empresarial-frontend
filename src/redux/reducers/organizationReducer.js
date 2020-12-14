import { SET_ORGANIZATION, REMOVE_ORGANIZATION } from '../actions/organizationAction';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_ORGANIZATION:
      return {
        ...state,
        mineOrg: action.body
      }
      break;
    case REMOVE_ORGANIZATION:
      return {
        ...state,
        mineOrg: undefined
      }
    default:
      return state;
  }
}
