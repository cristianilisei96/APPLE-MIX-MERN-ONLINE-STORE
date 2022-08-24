import {
  FAVORITES_LOADING,
  FAVORITES_LOADED,
  ADD_PRODUCT_TO_FAVORITE,
  REMOVE_FAVORITE_PRODUCT,
} from "./types";
import axios from "axios";
import { tokenConfig } from "./authActions";

export const setFavoritesLoading = () => {
  return {
    type: FAVORITES_LOADING,
  };
};

export const getUserFavorites = () => (dispatch, getState) => {
  dispatch(setFavoritesLoading());
  axios.get(`/favorites/`, tokenConfig(getState)).then((res) =>
    dispatch({
      type: FAVORITES_LOADED,
      payload: res.data,
    })
  );
};

export const addProductToFavorite =
  (favoritProduct) => (dispatch, getState) => {
    axios
      .post(
        `/favorites/add/${favoritProduct.product_id.toString()}/and/${favoritProduct.user_id.toString()}`,
        tokenConfig(getState)
      )
      .then((res) =>
        dispatch({
          type: ADD_PRODUCT_TO_FAVORITE,
          payload: res.data,
          favoritProduct: favoritProduct,
        })
      );
  };

export const deleteFavoriteProduct = (productId) => (dispatch, getState) => {
  axios
    .delete(`/favorites/delete/product/${productId}`, tokenConfig(getState))
    .then(
      dispatch({
        type: REMOVE_FAVORITE_PRODUCT,
        payload: productId,
      })
    );
};
