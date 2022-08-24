import axios from "axios";
import { returnErrors } from "./errorActions";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADING,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  AUTH_ERROR,
  UPDATE_PERSONAL_DATA_SUCCESS,
  UPDATE_PERSONAL_DATA_FAIL,
  POST_NEW_ADDRESS_SUCCESS,
  POST_NEW_ADDRESS_FAIL,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAIL,
  ADMINS_LOADED,
  ADMINS_LOADING,
} from "./types";

// done
// Register User
export const register =
  ({ role_id, alias, avatar, first_name, last_name, email, phone, password }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    // Request body
    const body = JSON.stringify({
      role_id,
      alias,
      avatar,
      first_name,
      last_name,
      email,
      phone,
      password,
    });

    axios
      .post("/users/register", body, config)
      .then((res) =>
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch(
          returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
        );
        dispatch({
          type: REGISTER_FAIL,
        });
      });
  };

// Login User
export const login =
  ({ email, password }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    // Request body
    const body = JSON.stringify({ email, password });

    axios
      .post("/users/login", body, config)
      .then((res) =>
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch(
          returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
        );
        dispatch({
          type: LOGIN_FAIL,
        });
      });
  };

// done
// Check token & load user
export const loadingUserConnected = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/users/loading-user-connected", tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

// done
export const editUserPersonalData =
  (newPersonalData) => (dispatch, getState) => {
    axios
      .put(
        "/users/update-user-personal-data",
        newPersonalData,
        tokenConfig(getState)
      )
      .then((res) =>
        dispatch({
          type: UPDATE_PERSONAL_DATA_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "UPDATE_PERSONAL_DATA_FAIL"
          )
        );
        dispatch({
          type: UPDATE_PERSONAL_DATA_FAIL,
        });
      });
  };

// done
export const postUserAddress =
  ({ user_id, first_name, last_name, phone, county, town, address }) =>
  (dispatch, getState) => {
    // Request body
    const body = {
      user_id,
      first_name,
      last_name,
      phone,
      county,
      town,
      address,
    };

    axios
      .post("/users/post-user-address", body, tokenConfig(getState))
      .then((res) =>
        dispatch({
          type: POST_NEW_ADDRESS_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "POST_NEW_ADDRESS_FAIL"
          )
        );
        dispatch({
          type: POST_NEW_ADDRESS_FAIL,
        });
      });
  };
// end done

// done
export const editUserAddress = (edited_address) => (dispatch, getState) => {
  axios
    .put("/users/update-user-address", edited_address, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: UPDATE_ADDRESS_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "UPDATE_ADDRESS_FAIL"
        )
      );
      dispatch({
        type: UPDATE_ADDRESS_FAIL,
      });
    });
};
// end done

export const setAdminsLoading = () => {
  return {
    type: ADMINS_LOADING,
  };
};

export const getAdmins = () => (dispatch) => {
  dispatch(setAdminsLoading());
  axios.get("/users/admins").then((res) =>
    dispatch({
      type: ADMINS_LOADED,
      payload: res.data,
    })
  );
};

// Setup config/headers and token
export const tokenConfig = (getState) => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};

// Logut User
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};
