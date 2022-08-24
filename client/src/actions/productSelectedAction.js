import {
  SELECTED_PRODUCT_LOADING,
  SELECTED_PRODUCT_LOADED,
  GET_REVIEWS_PRODUCT,
  POST_REVIEW_SUCCESS,
  POST_REVIEW_FAIL,
} from "./types";
import axios from "axios";
import { returnErrors } from "./errorActions";
import { tokenConfig } from "./authActions";

export const setProductLoading = () => {
  return {
    type: SELECTED_PRODUCT_LOADING,
  };
};

// done
export const getProductDetails = (product_id) => (dispatch) => {
  dispatch(setProductLoading());
  axios.get(`/products/${product_id}/get-product-details`).then((res) =>
    dispatch({
      type: SELECTED_PRODUCT_LOADED,
      payload: res.data,
    })
  );
};

// done
export const getProductReviews = (id) => (dispatch) => {
  axios.get(`/reviews/product/${id}/get-product-reviews`).then((res) =>
    dispatch({
      type: GET_REVIEWS_PRODUCT,
      payload: res.data,
    })
  );
};

// Register User
export const leaveReview =
  ({ product_id, user_id, name, rating, rating_text, message }) =>
  (dispatch, getState) => {
    // Headers
    // const config = {
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    // };

    // Request body
    const body = JSON.stringify({
      product_id,
      user_id,
      name,
      rating,
      rating_text,
      message,
    });

    axios
      .post("/reviews/post-review", body, tokenConfig(getState))
      .then((res) =>
        dispatch({
          type: POST_REVIEW_SUCCESS,
          payload: res.data,
          messageToUser: "Your review need to be moderate !",
        })
      )
      .catch((err) => {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "POST_REVIEW_FAIL"
          )
        );
        dispatch({
          type: POST_REVIEW_FAIL,
        });
      });
  };
