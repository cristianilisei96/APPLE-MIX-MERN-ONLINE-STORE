import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CategorySidebarComponent from "../../components/CategorySidebarComponent";
import { useSelector, useDispatch } from "react-redux";
import { getProductsFromCategory } from "../../actions/productsActions";
import SpinnerComponent from "../../components/SpinnerComponent";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  addProductToFavorite,
  deleteFavoriteProduct,
} from "../../actions/favoritesActions";
import { addProductToCart, deleteCartProduct } from "../../actions/cartActions";

const ProductsFromCategory = () => {
  const pathName = window.location.pathname;
  const category_name = pathName.split("/")[2].split("=")[1];

  const products = useSelector((state) => state.products.item);
  const favorites = useSelector((state) => state.auth.favorites.items);
  const cart = useSelector((state) => state.auth.cart.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const test = () => {
    console.log("ceva");
  };

  useEffect(() => {
    dispatch(
      getProductsFromCategory({
        category_name: category_name,
      })
    );
  }, [pathName, dispatch, test]);

  return (
    <>
      <Navbar />
      {products.length === 0 ? (
        <SpinnerComponent />
      ) : (
        <>
          <div id="selectedCategoryComponent">
            <div className="container">
              <div className="row">
                <CategorySidebarComponent />

                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-12 mb-4">
                      <div className="card bg-dark text-white">
                        <div className="card-body fw-bold">
                          {products.length === 0
                            ? "In this category are not products"
                            : ""}
                          {products.length === 1
                            ? `In this category are ${products.length} product`
                            : ""}
                          {products.length > 1
                            ? `In this category are ${products.length} products`
                            : ""}
                        </div>
                      </div>
                    </div>
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="col-md-6 col-lg-4 col-xl-4 mb-4"
                      >
                        <div className="card bg-dark text-white">
                          <Link to={`/product/${product.id}`}>
                            <img
                              src={product.product_image}
                              alt={product.product_name}
                              className="card-img-top bg-white text-black p-3"
                            />
                          </Link>
                          <div className="card-body">
                            <Link
                              to={`/product/${product.id}`}
                              className="text-white text-decoration-none"
                            >
                              <div id="infoProduct" className="text-center">
                                <h4>{product.product_name}</h4>
                                <p className="text-success fw-bold m-0">
                                  ${product.product_price}
                                </p>
                              </div>
                            </Link>

                            {product.product_quantity === 0 ? (
                              <>
                                {isAuthenticated ? (
                                  <div className="d-flex justify-content-between align-items-center">
                                    {favorites.find(
                                      (el) => el.id === product.id
                                    ) ? (
                                      <>
                                        <FontAwesomeIcon
                                          icon="heart"
                                          size="2x"
                                          className="text-danger cursor-pointer"
                                          onClick={() =>
                                            dispatch(
                                              deleteFavoriteProduct(product.id)
                                            )
                                          }
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <FontAwesomeIcon
                                          icon="heart-crack"
                                          size="2x"
                                          className="text-info cursor-pointer"
                                          onClick={() => {
                                            dispatch(
                                              addProductToFavorite({
                                                user_id: user.id,
                                                product_id: product.id,
                                                product_name:
                                                  product.product_name,
                                                product_image:
                                                  product.product_image,
                                                product_description:
                                                  product.product_description,
                                                product_category:
                                                  product.product_category,
                                                product_price:
                                                  product.product_price,
                                              })
                                            );
                                          }}
                                        />
                                      </>
                                    )}
                                    {cart.find((el) => el.id === product.id) ? (
                                      <FontAwesomeIcon
                                        icon="cart-shopping"
                                        className="text-success cursor-pointer"
                                        size="2x"
                                        onClick={() =>
                                          dispatch(
                                            deleteCartProduct(product.id)
                                          )
                                        }
                                      />
                                    ) : (
                                      <>
                                        <p className="fw-bold m-0">
                                          Out of stock
                                        </p>
                                      </>
                                      // <FontAwesomeIcon
                                      //   icon={faCartPlus}
                                      //   className="text-success cursor-pointer"
                                      //   size="2x"
                                      //   onClick={() => {
                                      //     dispatch(
                                      //       addProductToCart({
                                      //         user_id: user.id,
                                      //         product_id: product.id,
                                      //         product_name: product.product_name,
                                      //         product_image: product.product_image,
                                      //         product_description:
                                      //           product.product_description,
                                      //         product_category: product.product_category,
                                      //         product_quantity: 1,
                                      //         product_price: product.product_price,
                                      //       })
                                      //     );
                                      //   }}
                                      // />
                                    )}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </>
                            ) : (
                              <>
                                {isAuthenticated ? (
                                  <div className="d-flex justify-content-between align-items-center">
                                    {favorites.find(
                                      (el) => el.id === product.id
                                    ) ? (
                                      <FontAwesomeIcon
                                        icon="heart"
                                        size="2x"
                                        className="text-danger cursor-pointer"
                                        onClick={() =>
                                          dispatch(
                                            deleteFavoriteProduct(product.id)
                                          )
                                        }
                                      />
                                    ) : (
                                      <>
                                        <FontAwesomeIcon
                                          icon="heart-crack"
                                          size="2x"
                                          className="text-info cursor-pointer"
                                          onClick={() => {
                                            dispatch(
                                              addProductToFavorite({
                                                user_id: user.id,
                                                product_id: product.id,
                                                product_name:
                                                  product.product_name,
                                                product_image:
                                                  product.product_image,
                                                product_description:
                                                  product.product_description,
                                                product_category:
                                                  product.product_category,
                                                product_price:
                                                  product.product_price,
                                              })
                                            );
                                          }}
                                        />
                                      </>
                                    )}
                                    {cart.find((el) => el.id === product.id) ? (
                                      <FontAwesomeIcon
                                        icon="cart-shopping"
                                        className="text-success cursor-pointer"
                                        size="2x"
                                        onClick={() =>
                                          dispatch(
                                            deleteCartProduct(product.id)
                                          )
                                        }
                                      />
                                    ) : (
                                      <FontAwesomeIcon
                                        icon="cart-plus"
                                        className="text-warning cursor-pointer"
                                        size="2x"
                                        onClick={() => {
                                          dispatch(
                                            addProductToCart({
                                              user_id: user.id,
                                              product_id: product.id,
                                              product_name:
                                                product.product_name,
                                              product_image:
                                                product.product_image,
                                              product_description:
                                                product.product_description,
                                              product_category:
                                                product.product_category,
                                              product_quantity: 1,
                                              product_price:
                                                product.product_price,
                                            })
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default ProductsFromCategory;
