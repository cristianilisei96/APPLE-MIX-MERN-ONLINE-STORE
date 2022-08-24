import React, { useEffect } from "react";
import "./App.css";
import store from "./store";
import { loadingUserConnected } from "./actions/authActions";
import { getUserFavorites } from "./actions/favoritesActions";
import { getUserCart } from "./actions/cartActions";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import HomePage from "./pages/users/HomePage";
import LoginPage from "./pages/users/LoginPage";
import RegisterPage from "./pages/users/RegisterPage";
import MyAccount from "./pages/users/MyAccount";
import SearchResultPage from "./pages/users/SearchResultPage";
import PageNotFound from "./pages/users/PageNotFound";
import ProductPage from "./pages/users/ProductPage";
import Dashboard from "./pages/admins/Dashboard";
import MyOrders from "./pages/users/MyOrders";
import MyReviews from "./pages/users/MyReviews";
import ProductsFromCategory from "./pages/users/ProductsFromCategory";
import FavoritesPage from "./pages/users/FavoritesPage";
import CartPage from "./pages/users/CartPage";
import PersonalData from "./pages/users/PersonalData";
import Users from "./pages/admins/Users";
import Admins from "./pages/admins/Admins";
import Categories from "./pages/admins/Categories";
import Products from "./pages/admins/Products";
import Reviews from "./pages/admins/Reviews";
import ForgotPasswordPage from "./pages/users/Password/ForgotPasswordPage";
import ResetPasswordPage from "./pages/users/Password/ResetPasswordPage";
import Images from "./pages/admins/Images";
import Test from "./components/Test";

const App = () => {
  const tokenFromLocalStorage = localStorage.getItem("token");

  useEffect(() => {
    if (tokenFromLocalStorage) {
      store.dispatch(loadingUserConnected());
      store.dispatch(getUserFavorites());
      store.dispatch(getUserCart());
    }
  }, [tokenFromLocalStorage]);

  return (
    <Provider store={store}>
      <div className="App bg-secondary">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:product_id" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/forgotyourpassword"
              element={<ForgotPasswordPage />}
            />
            <Route
              path="/reset-password/user_id/:user_id/token/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/user/myaccount" element={<MyAccount />} />
            <Route path="/user/myorders" element={<MyOrders />} />
            <Route path="/user/myreviews" element={<MyReviews />} />
            <Route path="/user/personaldata" element={<PersonalData />} />
            <Route
              path="/products/category=:category_name"
              element={<ProductsFromCategory />}
            />

            <Route path="/user/favorites" element={<FavoritesPage />} />
            <Route path="/user/cart" element={<CartPage />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/dashboard/users" element={<Users />} />
            <Route path="/admin/dashboard/admins" element={<Admins />} />
            <Route
              path="/admin/dashboard/categories"
              element={<Categories />}
            />
            <Route path="/admin/dashboard/products" element={<Products />} />
            <Route path="/admin/dashboard/reviews" element={<Reviews />} />
            <Route path="/admin/dashboard/images" element={<Images />} />
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
