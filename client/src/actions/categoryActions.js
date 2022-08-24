import {
  CATEGORIES_LOADING,
  CATEGORIES_LOADED,
  ADMIN_ADD_NEW_CATEGORY_SUCCESS,
  ADMIN_ADD_NEW_CATEGORY_FAIL,
  ADMIN_EDITED_CATEGORY_SUCCESS,
  ADMIN_EDITED_CATEGORY_FAIL,
  CLEAR_MSG_FROM_CATEGORIES,
  ADMIN_DELETE_CATEGORY,
} from "./types";
import axios from "axios";
import { returnErrors } from "./errorActions";
import { tokenConfig } from "./usersActions";

export const setCategoriesLoading = () => {
  return {
    type: CATEGORIES_LOADING,
  };
};

export const getAllCategories = () => (dispatch) => {
  dispatch(setCategoriesLoading());
  axios.get("/categories/get-all-categories").then((res) =>
    dispatch({
      type: CATEGORIES_LOADED,
      payload: res.data,
    })
  );
};

// Register User
export const addNewCategory =
  ({ category_name, slug_name, icon }) =>
  (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    // Request body
    const body = JSON.stringify({
      slug_name,
      category_name,
      icon,
    });

    axios
      .post("/categories/addnewcategory", body, config)
      .then((res) =>
        dispatch({
          type: ADMIN_ADD_NEW_CATEGORY_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "ADMIN_ADD_NEW_CATEGORY_FAIL"
          )
        );
        dispatch({
          type: ADMIN_ADD_NEW_CATEGORY_FAIL,
        });
      });
  };

export const editCategory = (updatedCategory) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // Request body
  const body = JSON.stringify({
    updatedCategory,
  });

  axios
    .put(`/categories/category/update`, body, config)
    .then((res) =>
      dispatch({
        type: ADMIN_EDITED_CATEGORY_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "ADMIN_EDITED_CATEGORY_FAIL"
        )
      );
      dispatch({
        type: ADMIN_EDITED_CATEGORY_FAIL,
      });
    });
};

export const clearMsgFromCategories = () => (dispatch, getState) => {
  dispatch({
    type: CLEAR_MSG_FROM_CATEGORIES,
  });
};

export const deleteCategory = (id) => (dispatch, getState) => {
  axios
    .delete(`/categories/category/${id}`, tokenConfig(getState))
    .then(
      dispatch({
        type: ADMIN_DELETE_CATEGORY,
        payload: id,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
