import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import categoriesReducer from "./categoriesReducer";
import productsReducer from "./productsReducer";
import selectedProductReducer from "./selectedProductReducer";
import authReducer from "./authReducer";
import usersReducer from "./usersReducer";
import adminsReducer from "./adminsReducer";
import reviewsReducer from "./reviewsReducer";
import passwordsReducer from "./passwordsReducer";

export default combineReducers({
  categories: categoriesReducer,
  products: productsReducer,
  productSelected: selectedProductReducer,
  error: errorReducer,
  auth: authReducer,
  passwords: passwordsReducer,
  users: usersReducer,
  admins: adminsReducer,
  reviews: reviewsReducer,
});
