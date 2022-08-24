import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../actions/productsActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  decreaseQuantityProduct,
  increaseQuantityProduct,
  deleteCartProduct,
} from "../../actions/cartActions";

const CartPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const products = useSelector((state) => state.products.item);
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.auth.cart.items);

  const totalPrice = cart.reduce(
    (a, c) => a + c.product_price * c.product_quantity,
    0
  );

  const dispatch = useDispatch();

  return (
    <>
      <Navbar />
      {user ? (
        <>
          <div id="cartComponent">
            <div className="container">
              <div className="row">
                {cart.length === 0 ? (
                  <div className="col-md-12 mb-4">
                    <div className="card bg-dark text-white">
                      <div className="card-body text-center py-5">
                        <h2 className="title">Your cart is empty</h2>
                        <div>
                          <p className="fw-bold mb-0">
                            <Link
                              to="/"
                              className="text-success text-decoration-none"
                            >
                              Go back to store
                            </Link>{" "}
                            to continue shopping.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="col-lg-8 mb-4">
                      <div className="card bg-dark text-white py-3 mb-4">
                        <div className="card-body">
                          <h3 className="m-0">Your cart</h3>
                        </div>
                      </div>
                      <div className="card bg-dark text-white">
                        <div className="card-body">
                          <div
                            id="tableFavoritesProducts"
                            className="table-responsive"
                          >
                            <table className="table mb-0">
                              <thead>
                                <tr className="bg-success text-dark">
                                  <th scope="col" style={{ minWidth: "130px" }}>
                                    Image
                                  </th>
                                  <th scope="col" style={{ minWidth: "300px" }}>
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    style={{ minWidth: "80px" }}
                                    className="text-center"
                                  >
                                    Quantity
                                  </th>
                                  <th
                                    scope="col"
                                    style={{ minWidth: "60px" }}
                                    className="text-center"
                                  >
                                    Price
                                  </th>
                                  <th
                                    scope="col"
                                    style={{ minWidth: "60px" }}
                                    className="text-end"
                                  >
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <>
                                  {cart.map((product) => (
                                    <tr
                                      className="align-middle border-secondary text-white"
                                      key={product.id}
                                    >
                                      <th className="text-center">
                                        <Link to={`/product/${product.id}`}>
                                          <img
                                            src={product.product_image}
                                            alt={product.product_name}
                                            className="img-fluid"
                                            width="130"
                                          />
                                        </Link>
                                      </th>
                                      <th className="text-start">
                                        <Link
                                          to={`/product/${product.id}`}
                                          className="text-decoration-none text-white"
                                        >
                                          <h4 className="mb-0">
                                            {product.product_name}
                                          </h4>
                                        </Link>
                                      </th>
                                      <th>
                                        <div
                                          className="input-group mx-auto"
                                          style={{ width: "110px" }}
                                        >
                                          {product.product_quantity === 1 ? (
                                            <span className="input-group-btn">
                                              <button
                                                className="btn btn-success fw-bold text-dark"
                                                disabled
                                              >
                                                -
                                              </button>
                                            </span>
                                          ) : (
                                            <span className="input-group-btn">
                                              <button
                                                className="btn btn-success fw-bold text-dark"
                                                onClick={() =>
                                                  dispatch(
                                                    decreaseQuantityProduct(
                                                      user.id,
                                                      product.id,
                                                      product.product_quantity
                                                    )
                                                  )
                                                }
                                              >
                                                -
                                              </button>
                                            </span>
                                          )}

                                          <input
                                            type="text"
                                            name="quant[1]"
                                            className="form-control input-number text-center"
                                            value={product.product_quantity}
                                            min="1"
                                            onChange={() => {}}
                                            disabled
                                          />
                                          <span className="input-group-btn">
                                            <button
                                              className="btn btn-success fw-bold text-dark"
                                              onClick={() =>
                                                dispatch(
                                                  increaseQuantityProduct(
                                                    user.id,
                                                    product.id,
                                                    product.product_quantity
                                                  )
                                                )
                                              }
                                            >
                                              +
                                            </button>
                                          </span>
                                        </div>
                                      </th>
                                      <th className="text-center">
                                        <h4 className="text-success mb-0">
                                          ${product.product_price}
                                        </h4>
                                      </th>
                                      <th className="text-end">
                                        <button
                                          className="btn btn-danger"
                                          onClick={() =>
                                            dispatch(
                                              deleteCartProduct(product.id)
                                            )
                                          }
                                        >
                                          <FontAwesomeIcon icon="trash-alt" />
                                        </button>
                                      </th>
                                    </tr>
                                  ))}
                                </>
                              </tbody>
                            </table>
                          </div>

                          <hr />
                          <Link
                            to="/"
                            className="text-success text-decoration-none"
                          >
                            <span className="fw-bold float-start mb-0">
                              <FontAwesomeIcon icon="arrow-left" /> Back to shop
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mb-4">
                      <div className="card bg-dark text-white mb-4">
                        <div className="card-body">
                          <div className="form-group">
                            <label htmlFor="couponInput" className="mb-1">
                              Have coupon?
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                id="couponInput"
                                className="form-control coupon"
                                name=""
                                placeholder="Coupon code"
                                disabled
                              />
                              <span className="input-group-append">
                                <button className="btn btn-success" disabled>
                                  Apply
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card bg-dark text-white mb-4">
                        <div className="card-body">
                          <div className="mt-2">
                            <h4>Summary</h4>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between align-items-center">
                            <h6>Product cost</h6>
                            <h5>${totalPrice}.00</h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <h6>Delivery cost</h6>
                            <h5 className="text-success">FREE</h5>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Discount</h6>
                            <h5 className="text-danger mb-0">UNAVAILABLE</h5>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between mb-2">
                            <h5 className="text-uppercase">Total price</h5>
                            <h5 className="text-success fw-bold">
                              $ {totalPrice}.00
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="card bg-dark text-white">
                        <div className="card-body">
                          <button className="btn btn-success">Purchase</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </>
      ) : (
        <>
          <div id="cartComponent">
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-9 col-lg-7 col-xl-6 mx-auto mb-4">
                  <div
                    className="card bg-dark text-white"
                    style={{ borderRadius: 15 }}
                  >
                    <div className="card-body text-center py-5">
                      <h4 className="text-success fw-bold">
                        Your are not logged in
                      </h4>
                      <p className="fw-bold">
                        To add products to cart please log in.
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

export default CartPage;
