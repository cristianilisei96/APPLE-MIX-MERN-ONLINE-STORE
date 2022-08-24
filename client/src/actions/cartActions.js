import {
  CART_LOADING,
  CART_LOADED,
  DECREASE_QUANTITY_PRODUCT_CART,
  INCREASE_QUANTITY_PRODUCT_CART,
  ADD_PRODUCT_TO_CART,
  DELETE_CART_PRODUCT,
} from "./types";
import axios from "axios";
import { tokenConfig } from "./authActions";
import { returnErrors } from "./errorActions";

export const setCartLoading = () => {
  return {
    type: CART_LOADING,
  };
};

export const getUserCart = () => (dispatch, getState) => {
  dispatch(setCartLoading());
  axios.get(`/cart`, tokenConfig(getState)).then((res) =>
    dispatch({
      type: CART_LOADED,
      payload: res.data,
    })
  );
};

export const addProductToCart = (productToCart) => (dispatch, getState) => {
  axios
    .post(
      `/cart/add/${productToCart.product_id.toString()}/and/${productToCart.user_id.toString()}/and/${
        productToCart.product_quantity
      }`,
      tokenConfig(getState)
    )
    .then((res) =>
      dispatch({
        type: ADD_PRODUCT_TO_CART,
        payload: res.data,
        productToCart,
      })
    );
};

export const decreaseQuantityProduct =
  (user_id, product_id, product_quantity) => (dispatch, getState) => {
    axios
      .put(
        `/cart/decrease/quantity/${product_quantity}/where/user_id/${user_id}/and/product_id/${product_id}`,
        tokenConfig(getState)
      )
      .then(
        dispatch({
          type: DECREASE_QUANTITY_PRODUCT_CART,
          product_id: product_id,
          newQuantityValue: --product_quantity,
        })
      );
  };

export const increaseQuantityProduct =
  (user_id, product_id, product_quantity) => (dispatch, getState) => {
    axios
      .put(
        `/cart/increase/quantity/${product_quantity}/where/user_id/${user_id}/and/product_id/${product_id}`,
        tokenConfig(getState)
      )
      .then(
        dispatch({
          type: INCREASE_QUANTITY_PRODUCT_CART,
          product_id: product_id,
          newQuantityValue: ++product_quantity,
        })
      );
  };

export const deleteCartProduct = (productId) => (dispatch, getState) => {
  axios.delete(`/cart/product/${productId}`, tokenConfig(getState)).then(
    dispatch({
      type: DELETE_CART_PRODUCT,
      payload: productId,
    })
  );
};
