import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADING,
  USER_LOADED,
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  UPDATE_PERSONAL_DATA_SUCCESS,
  UPDATE_PERSONAL_DATA_FAIL,
  FAVORITES_LOADED,
  FAVORITES_LOADING,
  ADD_PRODUCT_TO_FAVORITE,
  REMOVE_FAVORITE_PRODUCT,
  CART_LOADING,
  CART_LOADED,
  ADD_PRODUCT_TO_CART,
  INCREASE_QUANTITY_PRODUCT_CART,
  DELETE_CART_PRODUCT,
  DECREASE_QUANTITY_PRODUCT_CART,
  AUTH_ERROR,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  favorites: {
    loading: false,
    items: [],
  },
  cart: {
    loading: false,
    items: [],
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return {
        isAuthenticated: null,
        isLoading: false,
        user: null,
        favorites: {
          loading: false,
          items: [],
        },
        cart: {
          loading: false,
          items: [],
        },
      };
    case AUTH_ERROR:
      localStorage.removeItem("token");
      return {
        token: localStorage.getItem("token"),
        isAuthenticated: null,
        isLoading: false,
        user: null,
        favorites: {
          loading: false,
          items: [],
        },
        cart: {
          loading: false,
          items: [],
        },
      };
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case UPDATE_PERSONAL_DATA_SUCCESS:
      return {
        ...state,
        user: action.payload,
      };
    case UPDATE_PERSONAL_DATA_FAIL:
      return {
        ...state,
      };
    case FAVORITES_LOADING:
      return {
        ...state,
        favorites: {
          loading: true,
          items: [],
        },
      };
    case FAVORITES_LOADED:
      return {
        ...state,
        favorites: {
          loading: false,
          items: action.payload,
        },
      };
    case ADD_PRODUCT_TO_FAVORITE:
      return {
        ...state,
        favorites: {
          loading: false,
          items: [
            ...state.favorites.items,
            {
              id: action.favoritProduct.product_id,
              product_name: action.favoritProduct.product_name,
              product_image: action.favoritProduct.product_image,
              product_description: action.favoritProduct.product_description,
              product_category: action.favoritProduct.product_category,
              product_price: action.favoritProduct.product_price,
              created_at: action.favoritProduct.created_at,
              updated_at: action.favoritProduct.updated_at,
            },
          ],
        },
      };
    case ADD_PRODUCT_TO_CART:
      return {
        ...state,
        cart: {
          loading: false,
          items: [
            ...state.cart.items,
            {
              id: action.productToCart.product_id,
              product_name: action.productToCart.product_name,
              product_image: action.productToCart.product_image,
              product_description: action.productToCart.product_description,
              product_category: action.productToCart.product_category,
              product_quantity: action.productToCart.product_quantity,
              product_price: action.productToCart.product_price,
              created_at: action.productToCart.created_at,
              updated_at: action.productToCart.updated_at,
            },
          ],
        },
      };
    case REMOVE_FAVORITE_PRODUCT:
      return {
        ...state,
        favorites: {
          loading: false,
          items: state.favorites.items.filter(
            (item) => item.id !== action.payload
          ),
        },
      };
    case CART_LOADING:
      return {
        ...state,
        cart: {
          loading: true,
          items: [],
        },
      };
    case CART_LOADED:
      return {
        ...state,
        cart: {
          loading: false,
          items: action.payload,
        },
      };
    case DECREASE_QUANTITY_PRODUCT_CART:
      return {
        ...state,
        cart: {
          loading: false,
          items: state.cart.items.map((item) =>
            item.id === action.product_id
              ? { ...item, product_quantity: action.newQuantityValue }
              : item
          ),
        },
      };
    case INCREASE_QUANTITY_PRODUCT_CART:
      return {
        ...state,
        cart: {
          loading: false,
          items: state.cart.items.map((item) =>
            item.id === action.product_id
              ? { ...item, product_quantity: action.newQuantityValue }
              : item
          ),
        },
      };
    case DELETE_CART_PRODUCT:
      return {
        ...state,
        cart: {
          loading: false,
          items: state.cart.items.filter((item) => item.id !== action.payload),
        },
      };
    default:
      return state;
  }
}
