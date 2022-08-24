import { ADMINS_LOADING, ADMINS_LOADED } from "../actions/types";

const initialState = {
  item: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADMINS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case ADMINS_LOADED:
      return {
        ...state,
        item: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
