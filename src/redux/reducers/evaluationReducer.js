import { SET_YEAR_EVALUATION } from '../actions/evaluationAction';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_YEAR_EVALUATION:
      return {
        ...state,
        year: action.year,
      }
      break;
    default:
      return state;
  }
}
