import axios from "axios";
import { returnErrors } from "./errorActions";

import {
  RECOVER_SUCCESS,
  CLEAR_RECOVER_MESSAGE,
  RECOVER_FAIL,
  CHECK_IF_TOKEN_IS_NOT_EXPIRE,
  CHECK_IF_TOKEN_IS_NOT_EXPIRE_FAIL,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
} from "./types";

export const forgotPassword =
  ({ email }) =>
  (dispatch, getState) => {
    // Headers
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    // Request body
    const body = JSON.stringify({
      email,
    });

    axios
      .post(
        "/passwords/forgotyourpassword",
        body,
        config,
        tokenRecoverConfig(getState)
      )
      .then((res) =>
        dispatch({
          type: RECOVER_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch(
          returnErrors(err.response.data, err.response.status, "RECOVER_FAIL")
        );
        dispatch({
          type: RECOVER_FAIL,
        });
      });
  };

export const clearRecoverMessage = () => (dispatch) => {
  dispatch({
    type: CLEAR_RECOVER_MESSAGE,
  });
};

export const checkTokenIsValid = (token) => (dispatch, getState) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // Request body
  const body = JSON.stringify({
    token,
  });

  axios
    .post(
      "/passwords/check-if-token-is-valid",
      body,
      config,
      tokenRecoverConfig(getState)
    )
    .then((res) =>
      dispatch({
        type: CHECK_IF_TOKEN_IS_NOT_EXPIRE,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "CHECK_IF_TOKEN_IS_NOT_EXPIRE_FAIL"
        )
      );
      dispatch({
        type: CHECK_IF_TOKEN_IS_NOT_EXPIRE_FAIL,
      });
    });
};

export const changePassword =
  ({ user_id, new_password }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    // Request body
    const body = JSON.stringify({
      user_id,
      new_password,
    });

    axios
      .post(
        "/passwords/reset-password/user_id/:user_id/token/:token",
        body,
        config
      )
      .then((res) =>
        dispatch({
          type: CHANGE_PASSWORD_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "CHANGE_PASSWORD_FAIL"
          )
        );
        dispatch({
          type: CHANGE_PASSWORD_FAIL,
        });
      });
  };

// Setup config/headers and token
export const tokenRecoverConfig = (getState) => {
  // Get token from localstorage
  const token = getState().passwords.tokenForRecover;

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) {
    config.headers["token-for-recover"] = token;
  }

  return config;
};
