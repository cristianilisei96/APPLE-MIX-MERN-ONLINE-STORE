import {
  PRODUCTS_LOADING,
  PRODUCTS_LOADED,
  GET_PRODUCTS_FROM_CATEGORY,
  ADMIN_DELETE_PRODUCT,
} from "../actions/types";

const initialState = {
  item: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PRODUCTS_LOADED:
      return {
        ...state,
        item: action.payload,
        loading: false,
      };
    case GET_PRODUCTS_FROM_CATEGORY:
      return {
        ...state,
        item: action.payload,
        loading: false,
      };
    case PRODUCTS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case ADMIN_DELETE_PRODUCT:
      return {
        ...state,
        item: state.item.filter((item) => item.id !== action.payload),
        loading: false,
      };
    default:
      return state;
  }
}
