import {
  USERS_LOADED,
  USERS_LOADING,
  SWITCH_ROLE_TO_ADMIN,
  SWITCH_ROLE_TO_USER,
  ADMIN_DELETE_USER,
} from "../actions/types";

const initialState = {
  item: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USERS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case USERS_LOADED:
      return {
        ...state,
        item: action.payload,
        loading: false,
      };
    case SWITCH_ROLE_TO_ADMIN:
      return {
        ...state,
        item: state.item.map((user) =>
          user.id === action.payload.id
            ? { ...user, role_id: action.payload.role_id }
            : user
        ),
      };
    case SWITCH_ROLE_TO_USER:
      return {
        ...state,
        item: state.item.map((user) =>
          user.id === action.payload.id
            ? { ...user, role_id: action.payload.role_id }
            : user
        ),
      };
    case ADMIN_DELETE_USER:
      return {
        ...state,
        item: state.item.filter((item) => item.id !== Number(action.payload)),
      };
    default:
      return state;
  }
}
