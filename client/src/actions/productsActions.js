import {
  PRODUCTS_LOADING,
  PRODUCTS_LOADED,
  GET_PRODUCTS_FROM_CATEGORY,
  ADMIN_ADD_PRODUCT_SUCCESS,
  ADMIN_ADD_PRODUCT_FAIl,
  ADMIN_EDIT_PRODUCT_SUCCESS,
  ADMIN_EDIT_PRODUCT_FAIL,
  ADMIN_DELETE_PRODUCT,
} from "./types";
import axios from "axios";
import { returnErrors } from "./errorActions";
import { tokenConfig } from "./usersActions";

export const setProductsLoading = () => {
  return {
    type: PRODUCTS_LOADING,
  };
};

export const getProducts = () => (dispatch, getState) => {
  dispatch(setProductsLoading());
  axios.get("/products", tokenConfig(getState)).then((res) =>
    dispatch({
      type: PRODUCTS_LOADED,
      payload: res.data,
    })
  );
};

export const addNewProduct = (newProduct) => (dispatch, getState) => {
  axios
    .post("/products/addnewproduct", newProduct, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: ADMIN_ADD_PRODUCT_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "ADMIN_ADD_PRODUCT_FAIl"
        )
      );
      dispatch({
        type: ADMIN_ADD_PRODUCT_FAIl,
      });
    });
};

export const editProductFunction = (editProduct) => (dispatch, getState) => {
  // console.log(editProduct);
  axios
    .put(`/products/updateproduct`, editProduct, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: ADMIN_EDIT_PRODUCT_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "ADMIN_EDIT_PRODUCT_FAIL"
        )
      );
      dispatch({
        type: ADMIN_EDIT_PRODUCT_FAIL,
      });
    });
};

export const getProductsFromCategory = (category) => (dispatch) => {
  axios.get(`/products/category/${category.category_name}`).then((res) =>
    dispatch({
      type: GET_PRODUCTS_FROM_CATEGORY,
      payload: res.data,
    })
  );
};

export const deleteProduct = (id) => (dispatch, getState) => {
  axios
    .delete(`/products/${id}`, tokenConfig(getState))
    .then(
      dispatch({
        type: ADMIN_DELETE_PRODUCT,
        payload: id,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
