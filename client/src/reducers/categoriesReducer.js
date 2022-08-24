import {
  CATEGORIES_LOADING,
  CATEGORIES_LOADED,
  ADMIN_ADD_NEW_CATEGORY_SUCCESS,
  ADMIN_ADD_NEW_CATEGORY_FAIL,
  ADMIN_EDITED_CATEGORY_SUCCESS,
  ADMIN_EDITED_CATEGORY_FAIL,
  CLEAR_MSG_FROM_CATEGORIES,
  ADMIN_DELETE_CATEGORY,
} from "../actions/types";

const initialState = {
  category: [],
  msg: "",
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CATEGORIES_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CATEGORIES_LOADED:
      return {
        ...state,
        category: action.payload,
        loading: false,
      };
    case ADMIN_ADD_NEW_CATEGORY_SUCCESS:
      return {
        ...state,
        msg: "The category was created with success!",
      };
    case ADMIN_ADD_NEW_CATEGORY_FAIL:
    case ADMIN_EDITED_CATEGORY_SUCCESS:
      return {
        ...state,
        msg: "The category was updated with success!",
      };
    case ADMIN_EDITED_CATEGORY_FAIL:
    case CLEAR_MSG_FROM_CATEGORIES:
      return {
        ...state,
        msg: "",
      };
    case ADMIN_DELETE_CATEGORY:
      return {
        ...state,
        category: state.category.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}
