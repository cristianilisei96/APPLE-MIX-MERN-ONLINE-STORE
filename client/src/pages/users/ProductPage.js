import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductDetails,
  getProductReviews,
} from "../../actions/productSelectedAction";
import { Alert } from "reactstrap";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactStars from "react-rating-stars-component";
import SpinnerComponent from "../../components/SpinnerComponent";
import { leaveReview } from "../../actions/productSelectedAction";
import { clearErrors } from "../../actions/errorActions";
import SimpleDateTime from "react-simple-timestamp-to-date";
import {
  addProductToFavorite,
  deleteFavoriteProduct,
} from "../../actions/favoritesActions";
import { addProductToCart, deleteCartProduct } from "../../actions/cartActions";

const ProductPage = () => {
  const product = useSelector((state) => state.productSelected.product);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const favorites = useSelector((state) => state.auth.favorites.items);
  const cart = useSelector((state) => state.auth.cart.items);

  const reviews = useSelector((state) => state.productSelected.reviews);
  const msgFromNewReview = useSelector((state) => state.productSelected.msg);

  const error = useSelector((state) => state.error);

  const product_id = useParams();

  const dispatch = useDispatch();

  const [alert, setAlert] = useState(true);
  const [goodAlert, setGoodAlert] = useState(null);

  const [state, setState] = useState({
    msg: "",
  });

  const [newReview, setNewReview] = useState({
    product_id: product_id.product_id,
    user_id: "",
    rating: 0,
    rating_text: "Leave a note",
    message: "",
  });

  const onChangeMessage = (e) => {
    e.preventDefault();

    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value,
    });
  };

  const ratingChanged = (newRating) => {
    console.log(newRating);

    if (newRating === 1) {
      setNewReview({
        ...newReview,
        user_id: user.id,
        rating: newRating,
        rating_text: "I don't recommend",
      });
    } else if (newRating === 2) {
      setNewReview({
        ...newReview,
        user_id: user.id,
        rating: newRating,
        rating_text: "Weak",
      });
    } else if (newRating === 3) {
      setNewReview({
        ...newReview,
        user_id: user.id,
        rating: newRating,
        rating_text: "Acceptable",
      });
    } else if (newRating === 4) {
      setNewReview({
        ...newReview,
        user_id: user.id,
        rating: newRating,
        rating_text: "Good",
      });
    } else if (newRating === 5) {
      setNewReview({
        ...newReview,
        user_id: user.id,
        rating: newRating,
        rating_text: "Excellent",
      });
    }
  };

  const addNewComment = (e) => {
    e.preventDefault();

    dispatch(clearErrors());

    console.log(newReview.rating_text);

    const detailsNewReview = {
      product_id: newReview.product_id,
      user_id: newReview.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      rating: newReview.rating,
      rating_text: newReview.rating_text,
      message: newReview.message,
    };

    dispatch(leaveReview(detailsNewReview));

    setGoodAlert(true);

    setNewReview({
      ...newReview,
      rating: 0,
      rating_text: "Leave a note",
      message: "",
    });
  };

  useEffect(() => {
    if (error.id === "ADD_NEW_REVIEW_FAIL") {
      setState({ ...state, msg: error.msg.msg });
      setAlert(true);
      setGoodAlert(true);
    }
    dispatch(getProductDetails(product_id.product_id));
    dispatch(getProductReviews(product_id.product_id));
  }, [error, dispatch, product_id.product_id]);

  return (
    <>
      <Navbar />
      {product.length === 0 ? (
        <SpinnerComponent />
      ) : (
        <div id="productComponent">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card border-dark">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 my-4">
                        <div className="text-xs-center text-sm-center text-md-center text-lg-end">
                          <img
                            src={product[0].product_image}
                            alt={product[0].product_name}
                            className="img-fluid"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 my-auto">
                        <div className="card border-0">
                          <div className="card-body">
                            <div className="p-2 text-light">
                              <h3 className="text-black text-xs-center text-sm-center text-md-center text-lg-start text-xl-start">
                                {product[0].product_name}
                              </h3>
                              <h5 className="fw-bold text-success text-xs-center text-sm-center text-md-center text-lg-start mb-3">
                                ${product[0].product_price}
                              </h5>

                              <h4 className="text-black text-xs-center text-sm-center text-md-center text-lg-start">
                                Description
                              </h4>
                              <p className="text-secondary fw-bold text-xs-center text-sm-center text-md-center text-lg-start">
                                {product[0].product_description}
                              </p>

                              {product[0].product_quantity === 0 ? (
                                <p className="fw-bold m-0">Out of stock</p>
                              ) : (
                                <>
                                  <div className="d-flex justify-content-center justify-content-lg-start align-items-center">
                                    {isAuthenticated ? (
                                      <>
                                        {favorites.find(
                                          (el) => el.id === product[0].id
                                        ) ? (
                                          <FontAwesomeIcon
                                            icon="heart"
                                            size="2x"
                                            className="text-danger cursor-pointer me-4"
                                            onClick={() =>
                                              dispatch(
                                                deleteFavoriteProduct(
                                                  product[0].id
                                                )
                                              )
                                            }
                                          />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon="heart-crack"
                                            size="2x"
                                            className="text-info text-center cursor-pointer me-4"
                                            onClick={() =>
                                              dispatch(
                                                addProductToFavorite({
                                                  user_id: user.id,
                                                  product_id: product[0].id,
                                                  product_name:
                                                    product[0].product_name,
                                                  product_image:
                                                    product[0].product_image,
                                                  product_description:
                                                    product[0]
                                                      .product_description,
                                                  product_category:
                                                    product[0].product_category,
                                                  product_price:
                                                    product[0].product_price,
                                                  created_at:
                                                    product[0].created_at,
                                                  updated_at:
                                                    product[0]
                                                      .product_updated_at,
                                                })
                                              )
                                            }
                                          />
                                        )}
                                        {cart.find(
                                          (el) => el.id === product[0].id
                                        ) ? (
                                          <FontAwesomeIcon
                                            icon="cart-shopping"
                                            className="text-success cursor-pointer me-4"
                                            size="2x"
                                            onClick={() =>
                                              dispatch(
                                                deleteCartProduct(product[0].id)
                                              )
                                            }
                                          />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon="cart-plus"
                                            className="text-warning cursor-pointer me-4"
                                            size="2x"
                                            onClick={() =>
                                              dispatch(
                                                addProductToCart({
                                                  user_id: user.id,
                                                  product_id: product[0].id,
                                                  product_name:
                                                    product[0].product_name,
                                                  product_image:
                                                    product[0].product_image,
                                                  product_description:
                                                    product[0]
                                                      .product_description,
                                                  product_category:
                                                    product[0].product_category,
                                                  product_quantity: 1,
                                                  product_price:
                                                    product[0].product_price,
                                                  created_at:
                                                    product[0].created_at,
                                                  updated_at:
                                                    product[0]
                                                      .product_updated_at,
                                                })
                                              )
                                            }
                                          />
                                        )}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 my-4">
                <div className="card bg-dark text-white">
                  <div className="card-body">
                    {msgFromNewReview.length > 0 ? (
                      <>
                        <Alert
                          color="success"
                          isOpen={goodAlert}
                          toggle={function noRefCheck() {
                            setGoodAlert(false);
                          }}
                        >
                          {msgFromNewReview}
                        </Alert>
                      </>
                    ) : (
                      ""
                    )}
                    {reviews.length !== 0 ? (
                      <>
                        {state.msg ? (
                          <>
                            <Alert
                              color="danger"
                              isOpen={alert}
                              toggle={function noRefCheck() {
                                setAlert(false);
                                dispatch(clearErrors());
                              }}
                            >
                              {state.msg}
                            </Alert>
                          </>
                        ) : null}
                        {isAuthenticated ? (
                          <div className="d-flex justify-space-between align-items-center py-4 mb-3 border-bottom">
                            <div className="left w-25 text-center">
                              {user && user.avatar === "Need revision" ? (
                                <img
                                  width="80"
                                  height="80"
                                  className="rounded-circle mb-2"
                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=="
                                  alt="ceva"
                                />
                              ) : (
                                <img
                                  width="80"
                                  height="80"
                                  className="rounded-circle mb-2"
                                  src={user.avatar}
                                  alt={user.first_name + " " + user.last_name}
                                />
                              )}
                              <h4 className="m-0">
                                {user
                                  ? user.first_name + " " + user.last_name
                                  : ""}
                              </h4>
                            </div>
                            <div className="right w-75">
                              <div className="user-leave-review">
                                <ReactStars
                                  count={5}
                                  onChange={ratingChanged}
                                  size={35}
                                  activeColor="#fcea10"
                                  id="reactStarsParent"
                                  classNames="mb-2 d-inline"
                                />
                                <h4 className="text-end">
                                  {newReview.rating_text}
                                </h4>
                              </div>
                              <div className="input-group mb-3">
                                <input
                                  name="message"
                                  type="text"
                                  className="form-control"
                                  placeholder="Add a public review..."
                                  value={newReview.message}
                                  onChange={onChangeMessage}
                                />

                                <button
                                  className="btn btn-success btn-block btn-lg text-dark float-end"
                                  onClick={addNewComment}
                                >
                                  <FontAwesomeIcon icon="gavel" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        {reviews.map((review) =>
                          review.status === "active" ? (
                            <div
                              key={review.id}
                              className="d-flex justify-content-between align-items-center divReviewProduct py-4 mb-3 border-bottom"
                            >
                              <div className="user-details text-end w-25 pe-4">
                                {review.avatar === "Need revision" ? (
                                  <img
                                    width="60"
                                    height="60"
                                    className="rounded-circle mb-2"
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=="
                                    alt="ceva"
                                  />
                                ) : (
                                  <img
                                    width="60"
                                    height="60"
                                    className="rounded-circle mb-2"
                                    src={review.avatar}
                                    alt={
                                      user
                                        ? user.first_name + " " + user.last_name
                                        : null
                                    }
                                  />
                                )}

                                <h5 className="fw-bold">
                                  {review.first_name} {review.last_name}
                                </h5>
                                <p className="m-0">
                                  <SimpleDateTime
                                    dateSeparator="-"
                                    showTime="0"
                                    dateFormat="DMY"
                                  >
                                    {review.created_at}
                                  </SimpleDateTime>
                                </p>
                              </div>
                              <div className="user-raiting-and-message w-75">
                                <h4>{review.rating_text}</h4>
                                {review.rating === 1 ? (
                                  <>
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <div className="mb-2"></div>
                                  </>
                                ) : (
                                  ""
                                )}
                                {review.rating === 2 ? (
                                  <>
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <div className="mb-2"></div>
                                  </>
                                ) : (
                                  ""
                                )}
                                {review.rating === 3 ? (
                                  <>
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <div className="mb-2"></div>
                                  </>
                                ) : (
                                  ""
                                )}
                                {review.rating === 4 ? (
                                  <>
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <div className="mb-2"></div>
                                  </>
                                ) : (
                                  ""
                                )}
                                {review.rating === 5 ? (
                                  <>
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <FontAwesomeIcon
                                      icon="star"
                                      color="#fcea10"
                                      size="1x"
                                    />
                                    <div className="mb-2"></div>
                                    <p>{review.message}</p>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        )}
                      </>
                    ) : (
                      <>
                        {state.msg ? (
                          <>
                            <Alert
                              color="danger"
                              isOpen={alert}
                              toggle={function noRefCheck() {
                                setAlert(false);
                              }}
                            >
                              {state.msg}
                            </Alert>
                          </>
                        ) : null}
                        {isAuthenticated ? (
                          <>
                            <div className="d-flex align-items-center">
                              <div className="left w-25 text-center">
                                {user && user.avatar === "Need revision" ? (
                                  <img
                                    width="40"
                                    height="40"
                                    className="rounded-circle mb-2"
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=="
                                    alt="ceva"
                                  />
                                ) : (
                                  <img
                                    width="40"
                                    height="40"
                                    className="rounded-circle mb-2"
                                    src={user ? user.avatar : null}
                                    alt="ceva"
                                  />
                                )}
                                <h5 className="m-0">
                                  {user
                                    ? user.first_name + " " + user.last_name
                                    : ""}
                                </h5>
                              </div>
                              <div className="right w-75">
                                <div className="position-relative">
                                  <ReactStars
                                    count={5}
                                    onChange={ratingChanged}
                                    size={24}
                                    activeColor="#fcea10"
                                    id="reactStarsParent"
                                    classNames="mb-2 d-inline"
                                  />
                                  <h4
                                    id="ceva"
                                    style={{
                                      float: "right",
                                      right: 0,
                                      bottom: 0,
                                    }}
                                  >
                                    {newReview.rating_text}
                                  </h4>
                                </div>
                                <div className="input-group mb-3">
                                  <input
                                    name="message"
                                    type="text"
                                    className="form-control"
                                    placeholder="Add a public review..."
                                    value={newReview.message}
                                    onChange={onChangeMessage}
                                  />

                                  <button
                                    className="btn btn-success btn-block btn-lg text-dark float-end"
                                    onClick={addNewComment}
                                  >
                                    <FontAwesomeIcon icon="gavel" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        <p className="text-center m-0">
                          This product has no reviews yet!
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {product.length > 0 ? <Footer /> : ""}
    </>
  );
};

export default ProductPage;
