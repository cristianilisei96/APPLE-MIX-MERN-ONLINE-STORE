import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  faHeartBroken,
  faHeart,
  faCartPlus,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import {
  addProductToFavorite,
  deleteFavoriteProduct,
} from "../../actions/favoritesActions";
import { addProductToCart, deleteCartProduct } from "../../actions/cartActions";

const SearchResultsPage = () => {
  const [results, setResults] = useState("");

  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get("search");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.auth.favorites.items);
  const cart = useSelector((state) => state.auth.cart.items);

  const dispatch = useDispatch();

  useEffect(() => {
    if (searchTerm !== "empty") {
      axios
        .get(`/products/getproductbysearchword/${searchTerm}`)
        .then((res) => setResults(res.data));
    }
  }, [searchTerm]);

  return (
    <>
      <Navbar />
      <div id="searchResultsComponent">
        <div className="container">
          <div className="row">
            {results.length !== 0 ? (
              <div className="col-md-12 mb-4">
                <div className="card bg-dark text-white">
                  <div className="card-body">
                    <h5 className="mb-0">
                      <span className="text-success">
                        {results.length} results for:
                      </span>{" "}
                      "{searchTerm}"
                    </h5>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {results.length !== 0 ? (
              results.map((product) => (
                <div
                  key={product.id}
                  className="col-md-6 col-lg-4 col-xl-3 mb-4"
                >
                  <div className="card bg-dark text-white">
                    <Link
                      to={"/product/" + product.id}
                      className="text-white text-decoration-none"
                    >
                      <img
                        src={product.product_image}
                        alt={product.product_name}
                        className="card-img-top bg-white text-black p-3"
                      />
                    </Link>
                    <div className="card-body">
                      <Link
                        to={"/product/" + product.id}
                        className="text-white text-decoration-none"
                      >
                        <div id="infoProduct" className="text-center mb-4">
                          <h3>{product.product_name}</h3>
                          <h5 className="text-success fw-bold">
                            ${product.product_price}
                          </h5>
                        </div>
                      </Link>

                      {product.product_quantity === 0 ? (
                        <>
                          {isAuthenticated ? (
                            <div className="d-flex justify-content-between align-items-center">
                              {favorites.find((el) => el.id === product.id) ? (
                                <FontAwesomeIcon
                                  icon={faHeart}
                                  size="2x"
                                  className="text-danger cursor-pointer"
                                  onClick={() =>
                                    dispatch(deleteFavoriteProduct(product.id))
                                  }
                                />
                              ) : (
                                <>
                                  <FontAwesomeIcon
                                    icon={faHeartBroken}
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
                              {cart.find((el) => el.id === product.id) ? (
                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  className="text-success cursor-pointer"
                                  size="2x"
                                  onClick={() =>
                                    dispatch(deleteCartProduct(product.id))
                                  }
                                />
                              ) : (
                                <>
                                  <p className="fw-bold m-0">Out of stock</p>
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
                              {favorites.find((el) => el.id === product.id) ? (
                                <FontAwesomeIcon
                                  icon={faHeart}
                                  size="2x"
                                  className="text-danger cursor-pointer"
                                  onClick={() =>
                                    dispatch(deleteFavoriteProduct(product.id))
                                  }
                                />
                              ) : (
                                <>
                                  <FontAwesomeIcon
                                    icon={faHeartBroken}
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
                              {cart.find((el) => el.id === product.id) ? (
                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  className="text-success cursor-pointer"
                                  size="2x"
                                  onClick={() =>
                                    dispatch(deleteCartProduct(product.id))
                                  }
                                />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faCartPlus}
                                  className="text-success cursor-pointer"
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
                                        product_category:
                                          product.product_category,
                                        product_quantity: 1,
                                        product_price: product.product_price,
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
              ))
            ) : (
              <div className="col-md-12">
                <div className="card bg-dark text-white mb-4">
                  <div className="card-body">
                    <h5>
                      <span className="text-danger">
                        {results.length} results for:
                      </span>{" "}
                      "{searchTerm}"
                    </h5>
                    <li className="list-group fw-bold mb-0">
                      To find the product you want, try the following:
                    </li>
                    <ul className="mb-0">
                      <li>Check that you spelled the terms correctly.</li>
                      <li>Try using synonyms.</li>
                      <li>Please try again using a more general search.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SearchResultsPage;
