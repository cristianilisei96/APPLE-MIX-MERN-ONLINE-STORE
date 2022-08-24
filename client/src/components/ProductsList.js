import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  addProductToFavorite,
  deleteFavoriteProduct,
} from "../actions/favoritesActions";
import { addProductToCart, deleteCartProduct } from "../actions/cartActions";

const ProductsList = () => {
  const products = useSelector((state) => state.products.item);
  const favorites = useSelector((state) => state.auth.favorites.items);
  const cart = useSelector((state) => state.auth.cart.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  return (
    <div id="productsListComponent">
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
              <div className="card bg-dark text-white">
                <Link
                  to={`/product/${product.id}`}
                  className="text-white text-decoration-none"
                >
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="card-img-top bg-white text-black p-3 d-block"
                  />
                </Link>
                <div className="card-body">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-white text-decoration-none"
                  >
                    <div id="infoProduct" className="text-center">
                      <h4>{product.product_name}</h4>
                      <h5 className="text-success fw-bold">
                        ${product.product_price}
                      </h5>
                    </div>
                  </Link>

                  {product.product_quantity === 0 ? (
                    <>
                      {isAuthenticated ? (
                        <div className="d-flex justify-content-between align-items-center">
                          {favorites.find(
                            (product_favorites) =>
                              product_favorites.id === product.id
                          ) ? (
                            <FontAwesomeIcon
                              icon="heart"
                              size="2x"
                              className="text-danger cursor-pointer"
                              onClick={() =>
                                dispatch(deleteFavoriteProduct(product.id))
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
                                      product_name: product.product_name,
                                      product_image: product.product_image,
                                      product_description:
                                        product.product_description,
                                      product_category:
                                        product.product_category,
                                      product_price: product.product_price,
                                    })
                                  );
                                }}
                              />
                            </>
                          )}

                          {cart.find(
                            (product_cart) => product_cart.id === product.id
                          ) ? (
                            <>
                              {dispatch(deleteCartProduct(product.id))}
                              <p className="fw-bold m-0">Out of stock</p>
                            </>
                          ) : (
                            <p className="fw-bold m-0">Out of stock</p>
                          )}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {isAuthenticated ? (
                        <div className="d-flex justify-content-between align-items-center">
                          {favorites.find(
                            (product_favorites) =>
                              product_favorites.id === product.id
                          ) ? (
                            <FontAwesomeIcon
                              icon="heart"
                              size="2x"
                              className="text-danger cursor-pointer"
                              onClick={() =>
                                dispatch(deleteFavoriteProduct(product.id))
                              }
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon="heart-crack"
                              size="2x"
                              className="text-info cursor-pointer"
                              onClick={() => {
                                dispatch(
                                  addProductToFavorite({
                                    user_id: user.id,
                                    product_id: product.id,
                                    product_name: product.product_name,
                                    product_image: product.product_image,
                                    product_description:
                                      product.product_description,
                                    product_category: product.product_category,
                                    product_price: product.product_price,
                                  })
                                );
                              }}
                            />
                          )}

                          {cart.find(
                            (product_cart) => product_cart.id === product.id
                          ) ? (
                            <FontAwesomeIcon
                              icon="cart-shopping"
                              className="text-success cursor-pointer"
                              size="2x"
                              onClick={() =>
                                dispatch(deleteCartProduct(product.id))
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
                                    product_name: product.product_name,
                                    product_image: product.product_image,
                                    product_description:
                                      product.product_description,
                                    product_category: product.product_category,
                                    product_quantity: 1,
                                    product_price: product.product_price,
                                  })
                                );
                              }}
                            />
                          )}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
