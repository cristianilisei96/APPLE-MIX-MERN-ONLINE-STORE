import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getUserFavorites,
  deleteFavoriteProduct,
} from "../../actions/favoritesActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FavoritesPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.auth.favorites.items);

  const dispatch = useDispatch();

  return (
    <>
      <Navbar />
      {user ? (
        <>
          <div id="favoritesComponent">
            <div className="container">
              <div className="row">
                <div className="col-md-12 mb-4">
                  <div className="card border-dark">
                    <div className="card-header bg-dark text-white">
                      <span className="fw-bold fs-4">
                        Favorites :{" "}
                        <span id="numberOfUsers" className="text-danger">
                          {favorites.length}
                        </span>
                      </span>
                    </div>
                    <div className="card-body">
                      {favorites.length === 0 ? (
                        <div
                          id="emptyFavoritesContent"
                          className="py-4 text-center"
                        >
                          <h3 className="mb-0">
                            Hmm, no products on your favorites list.
                          </h3>
                          <h3 className="mb-4">
                            Here are some recommendations that might inspire
                            you.
                          </h3>

                          <Link
                            to="/"
                            className="btn btn-success text-dark btn-lg"
                          >
                            See products
                          </Link>
                        </div>
                      ) : (
                        <div
                          id="tableFavoritesProducts"
                          className="table-responsive"
                        >
                          <table className="table m-0">
                            <thead>
                              <tr>
                                <th scope="col">Image</th>
                                <th scope="col">Name</th>
                                <th scope="col">Status</th>
                                <th scope="col">Price</th>
                                <th scope="col" className="text-end">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {favorites.map((product) => (
                                <tr
                                  className="align-middle border-secondary text-dark"
                                  key={product.id}
                                >
                                  <>
                                    <th style={{ width: 100 }}>
                                      <Link to={`/product/${product.id}`}>
                                        <img
                                          src={product.product_image}
                                          alt={product.product_name}
                                          width="100"
                                        />
                                      </Link>
                                    </th>

                                    <th className="text-start">
                                      <Link
                                        to={`/product/${product.id}`}
                                        className="text-decoration-none text-dark"
                                      >
                                        <h4 className="mb-0">
                                          {product.product_name}
                                        </h4>
                                      </Link>
                                    </th>

                                    <th>
                                      {product.product_quantity === 0 ? (
                                        <span className="text-danger">
                                          out of stock
                                        </span>
                                      ) : (
                                        <span className="text-success">
                                          in stock
                                        </span>
                                      )}
                                    </th>

                                    <th>
                                      <h4 className="text-muted mb-0">
                                        ${product.product_price}
                                      </h4>
                                    </th>

                                    <th className="text-end">
                                      <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                          dispatch(
                                            deleteFavoriteProduct(product.id)
                                          )
                                        }
                                      >
                                        <FontAwesomeIcon icon="heart-crack" />
                                      </button>
                                    </th>
                                  </>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <table className="table mb-0"></table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      ) : (
        <>
          <div id="favoritesComponent">
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-9 col-lg-7 col-xl-6 mx-auto mb-4">
                  <div
                    className="card bg-dark text-white"
                    style={{ borderRadius: "15px" }}
                  >
                    <div className="card-body text-center py-5">
                      <h4 className="text-success fw-bold">
                        Your are not logged in
                      </h4>
                      <p className="fw-bold">
                        To add products to favorites please log in.
                      </p>
                      <Link
                        to="/login"
                        className="btn btn-success text-dark btn-block btn-lg"
                      >
                        Log In
                      </Link>
                    </div>
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

export default FavoritesPage;
