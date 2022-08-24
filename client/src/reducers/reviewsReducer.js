import {
  REVIEWS_LOADED,
  REVIEWS_LOADING,
  GET_ALL_USER_REVIEWS_SUCCESS,
  ADMIN_MODERATE_REVIEW,
  ADMIN_UNMODERATE_REVIEW,
  DELETE_REVIEW,
  ADMIN_DELETE_REVIEWS,
} from "../actions/types";

const initialState = {
  item: [],
  currentUserReviews: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case REVIEWS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case REVIEWS_LOADED:
      return {
        ...state,
        item: action.payload,
        loading: false,
      };
    case GET_ALL_USER_REVIEWS_SUCCESS:
      return {
        ...state,
        currentUserReviews: action.payload,
      };
    case ADMIN_MODERATE_REVIEW:
      console.log(action.payload);
      return {
        ...state,
        item: state.item.map((review) =>
          review.id === action.payload.id
            ? {
                ...review,
                status: action.payload.status,
                updated_at: action.payload.updated_at,
              }
            : review
        ),
        loading: false,
      };
    case ADMIN_UNMODERATE_REVIEW:
      return {
        ...state,
        item: state.item.map((review) =>
          review.id === action.payload.id
            ? {
                ...review,
                status: action.payload.statis,
                updated_at: action.payload.updated_at,
              }
            : review
        ),
        loading: false,
      };
    case DELETE_REVIEW:
      return {
        ...state,
        item: state.item.filter((item) => item.id !== action.payload),
        currentUserReviews: state.currentUserReviews.filter(
          (review) => review.id !== action.payload
        ),
      };
    case ADMIN_DELETE_REVIEWS:
      return {
        ...state,
        item: [],
      };
    default:
      return state;
  }
}
