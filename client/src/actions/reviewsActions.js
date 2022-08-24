import axios from "axios";
import { returnErrors } from "./errorActions";
import {
  REVIEWS_LOADED,
  ADMIN_MODERATE_REVIEW,
  ADMIN_UNMODERATE_REVIEW,
  DELETE_REVIEW,
  ADMIN_DELETE_REVIEWS,
  GET_ALL_USER_REVIEWS_SUCCESS,
} from "./types";

export const getReviews = () => (dispatch, getState) => {
  axios.get("/reviews", tokenConfig(getState)).then((res) =>
    dispatch({
      type: REVIEWS_LOADED,
      payload: res.data,
    })
  );
};

export const moderateReview = (reviewId) => (dispatch, getState) => {
  axios
    .put(`/reviews/moderated/product/${reviewId}`)
    .then((res) =>
      dispatch({
        type: ADMIN_MODERATE_REVIEW,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const unmoderateReview = (id) => (dispatch) => {
  axios.put(`/reviews/unmoderated/product/${id}`).then((res) => {
    dispatch({
      type: ADMIN_UNMODERATE_REVIEW,
      payload: res.data,
    });
  });
};

export const getCurrentUserReviews = () => (dispatch, getState) => {
  axios.get(`/reviews/get-user-reviews`, tokenConfig(getState)).then((res) =>
    dispatch({
      type: GET_ALL_USER_REVIEWS_SUCCESS,
      payload: res.data,
    })
  );
};

export const deleteReview = (id) => (dispatch, getState) => {
  axios
    .delete(`/reviews/delete/${id}`, tokenConfig(getState))
    .then(
      dispatch({
        type: DELETE_REVIEW,
        payload: id,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteReviews = () => (dispatch, getState) => {
  axios.delete("/reviews/deleteallreviews", tokenConfig(getState)).then(
    dispatch({
      type: ADMIN_DELETE_REVIEWS,
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
