import {
  SELECTED_PRODUCT_LOADING,
  SELECTED_PRODUCT_LOADED,
  GET_REVIEWS_PRODUCT,
  POST_REVIEW_SUCCESS,
} from "../actions/types";

const initialState = {
  product: [],
  reviews: [],
  loading: false,
  msg: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SELECTED_PRODUCT_LOADING:
      return {
        ...state,
        loading: true,
      };
    case SELECTED_PRODUCT_LOADED:
      return {
        ...state,
        product: action.payload,
        loading: false,
      };
    case GET_REVIEWS_PRODUCT:
      return {
        ...state,
        reviews: action.payload,
        loading: false,
      };
    case POST_REVIEW_SUCCESS:
      return {
        ...state,
        reviews: [...state.reviews],
        msg: action.messageToUser,
        loading: false,
      };
    default:
      return state;
  }
}
