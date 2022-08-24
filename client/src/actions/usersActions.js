import {
  USERS_LOADED,
  USERS_LOADING,
  SWITCH_ROLE_TO_ADMIN,
  SWITCH_ROLE_TO_USER,
  ADMIN_DELETE_USER,
} from "./types";
import axios from "axios";
import { returnErrors } from "./errorActions";

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

export const setUsersLoading = () => {
  return {
    type: USERS_LOADING,
  };
};

export const getUsers = () => (dispatch, getState) => {
  dispatch(setUsersLoading());
  axios.get("/users/getallusers", tokenConfig(getState)).then((res) =>
    dispatch({
      type: USERS_LOADED,
      payload: res.data,
    })
  );
};

export const switchRoleToAdmin = (userId) => (dispatch, getState) => {
  axios
    .put(`/users/usertoadmin/${userId}`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: SWITCH_ROLE_TO_ADMIN,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const switchRoleToUser = (userId) => (dispatch, getState) => {
  axios
    .put(`/users/usertouser/${userId}`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: SWITCH_ROLE_TO_USER,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// done
export const deleteUser = (id) => (dispatch, getState) => {
  axios
    .delete(`/users/deleteuser/${id}`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: ADMIN_DELETE_USER,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
// end done
