import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../actions/productsActions";
import SpinnerComponent from "../../components/SpinnerComponent";
import HeaderComponent from "../../components/HeaderComponent";
import ProductsList from "../../components/ProductsList";
import IphoneCarouselComponent from "../../components/IphoneCarouselComponent";
import Footer from "../../components/Footer";
import { getUserFavorites } from "../../actions/favoritesActions";
import { getUserCart } from "../../actions/cartActions";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors } from "../../actions/errorActions";

const HomePage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const products = useSelector((state) => state.products.item);
  const error = useSelector((state) => state.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProducts());

    if (isAuthenticated) {
      dispatch(getUserFavorites());
      dispatch(getUserCart());
    }
    if (error.msg.msg === "Token is not valid") {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenForRecover");
      navigate("/login");
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error]);

  return (
    <>
      <Navbar />

      {products.length === 0 ? (
        <SpinnerComponent />
      ) : (
        <>
          <HeaderComponent />
          <ProductsList />
          {/* <IphoneCarouselComponent /> */}
          <Footer />
        </>
      )}
    </>
  );
};

export default HomePage;
