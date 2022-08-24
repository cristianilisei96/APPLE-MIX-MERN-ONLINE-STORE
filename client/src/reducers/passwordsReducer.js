import {
  RECOVER_SUCCESS,
  RECOVER_FAIL,
  CHECK_IF_TOKEN_IS_NOT_EXPIRE,
  CHANGE_PASSWORD_SUCCESS,
  CLEAR_RECOVER_MESSAGE,
} from "../actions/types";

const initialState = {
  tokenForRecover: localStorage.getItem("tokenForRecover"),
  recover: "",
  reset: "",
  msg: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RECOVER_SUCCESS:
      localStorage.setItem("tokenForRecover", action.payload.tokenForRecover);
      return {
        ...state,
        ...action.payload,
        recover: "Email exist in database!",
      };
    case CHECK_IF_TOKEN_IS_NOT_EXPIRE:
      localStorage.setItem("tokenForRecover", action.payload.tokenForRecover);
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_RECOVER_MESSAGE:
      return {
        ...state,
        recover: "",
        msg: "",
      };
    case RECOVER_FAIL:
      return {
        ...state,
        recover: "",
      };
    case CHANGE_PASSWORD_SUCCESS:
      localStorage.removeItem("tokenForRecover");
      return {
        ...state,
        reset: "Password changed with success!",
      };
    default:
      return state;
  }
}
