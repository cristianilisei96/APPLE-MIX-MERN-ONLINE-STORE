import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import SidebarUser from "../../components/SidebarUser";
import Footer from "../../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUserReviews,
  unmoderateReview,
} from "../../actions/reviewsActions";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteReview } from "../../actions/reviewsActions";

const MyReviews = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const currentUserReviews = useSelector(
    (state) => state.reviews.currentUserReviews
  );

  const moderatedReviews = currentUserReviews.filter(
    (review) => review.status === "active"
  );

  const unmoderatedReviews = currentUserReviews.filter(
    (review) => review.status === "pending"
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const tokenFromLocalStorage = localStorage.getItem("token");

  useEffect(() => {
    if (!tokenFromLocalStorage) {
      navigate("/login");
    }
    if (isAuthenticated) {
      dispatch(getCurrentUserReviews());
    }
  }, [tokenFromLocalStorage, isAuthenticated, user, dispatch]);

  return (
    <>
      <Navbar />
      <div id="myReviewsComponent">
        <div className="container">
          <div className="row">
            <SidebarUser />
            <div className="col-md-12 col-lg-9 mb-4">
              <div className="card bg-dark text-white">
                <div className="card-body">
                  {currentUserReviews.length === 0 ? (
                    <h4 className="mb-0">
                      At the moment you have not left any reviews
                    </h4>
                  ) : (
                    <>
                      <ul
                        id="reviews-tab"
                        className="nav nav-tabs border-success"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className={
                              moderatedReviews.length > 0
                                ? "nav-link active"
                                : "nav-link"
                            }
                            id="moderated-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#moderated"
                            type="button"
                            role="tab"
                            aria-controls="moderated"
                            aria-selected={
                              moderatedReviews.length > 0 ? true : false
                            }
                            disabled={
                              moderatedReviews.length === 0 ? true : false
                            }
                          >
                            {moderatedReviews.length === 0 ? (
                              <>
                                <span className="text-info">
                                  {moderatedReviews.length}
                                </span>
                                <span> reviews moderated</span>
                              </>
                            ) : null}
                            {moderatedReviews.length === 1 ? (
                              <>
                                <span className="text-info">
                                  {moderatedReviews.length}
                                </span>
                                <span> review moderated</span>
                              </>
                            ) : null}
                            {moderatedReviews.length > 1 ? (
                              <>
                                <span className="text-info">
                                  {moderatedReviews.length}
                                </span>
                                <span> reviews moderated</span>
                              </>
                            ) : null}
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className={
                              unmoderatedReviews.length > 0 &&
                              moderatedReviews.length === 0
                                ? "nav-link active"
                                : "nav-link"
                            }
                            id="unmoderated-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#unmoderated"
                            type="button"
                            role="tab"
                            aria-controls="unmoderated"
                            aria-selected={
                              unmoderatedReviews.length > 0 ? true : false
                            }
                            disabled={
                              unmoderatedReviews.length === 0 ? true : false
                            }
                          >
                            {unmoderatedReviews.length === 0 ? (
                              <>
                                <span className="text-danger">
                                  {unmoderatedReviews.length}
                                </span>
                                <span> reviews unmoderated</span>
                              </>
                            ) : null}
                            {unmoderatedReviews.length === 1 ? (
                              <>
                                <span className="text-danger">
                                  {unmoderatedReviews.length}
                                </span>
                                <span> review unmoderated</span>
                              </>
                            ) : null}
                            {unmoderatedReviews.length > 1 ? (
                              <>
                                <span className="text-danger">
                                  {unmoderatedReviews.length}
                                </span>
                                <span> reviews unmoderated</span>
                              </>
                            ) : null}
                          </button>
                        </li>
                      </ul>
                      <div className="tab-content" id="reviews-tab-content">
                        <div
                          className={
                            moderatedReviews.length > 0
                              ? "tab-pane fade show active"
                              : "tab-pane fade"
                          }
                          id="moderated"
                          role="tabpanel"
                          aria-labelledby="moderated-tab"
                        >
                          {moderatedReviews.map((review) => (
                            <div
                              key={review.id}
                              className="row border-bottom border-success py-4 reviewCurrentUser justify-content-center align-items-center"
                            >
                              <div className="col-md-12 col-lg-2 text-xs-center text-sm-center text-md-center text-xl-center">
                                <Link
                                  to={`/product/${review.product_id}`}
                                  className="text-white text-decoration-none"
                                >
                                  <img
                                    src={review.product_image}
                                    className="img-fluid mb-2"
                                    alt={review.product_name}
                                  />
                                  <h5 className="mb-0">
                                    {review.product_name}
                                  </h5>
                                </Link>
                              </div>
                              <div className="col-md-12 col-lg-8">
                                <h4>{review.rating_text}</h4>
                                <div className="raiting">
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
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <p className="mb-0">{review.message}</p>
                              </div>
                              <div className="col-md-12 col-lg-2 text-center">
                                <h5>Status</h5>
                                <p className="text-success">{review.status}</p>
                                <button className="btn btn-warning">
                                  <FontAwesomeIcon icon="pen" />
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    dispatch(deleteReview(review.id))
                                  }
                                >
                                  <FontAwesomeIcon icon="trash" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div
                          className={
                            moderatedReviews.length === 0 &&
                            unmoderatedReviews.length > 0
                              ? "tab-pane fade show active"
                              : "tab-pane fade"
                          }
                          id="unmoderated"
                          role="tabpanel"
                          aria-labelledby="unmoderated-tab"
                        >
                          {unmoderatedReviews.map((review) => (
                            <div
                              key={review.id}
                              className="row border-bottom border-success py-4 reviewCurrentUser justify-content-center align-items-center"
                            >
                              <div className="col-md-12 col-lg-2 text-xs-center text-sm-center text-md-center text-xl-center">
                                <Link
                                  to={`/product/${review.product_id}`}
                                  className="text-white text-decoration-none"
                                >
                                  <img
                                    src={review.product_image}
                                    className="img-fluid mb-2"
                                    alt={review.product_name}
                                  />
                                  <h5 className="mb-0">
                                    {review.product_name}
                                  </h5>
                                </Link>
                              </div>
                              <div className="col-md-12 col-lg-8">
                                <h4>{review.rating_text}</h4>
                                <div className="raiting">
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
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <p className="mb-0">{review.message}</p>
                              </div>
                              <div className="col-md-12 col-lg-2 text-center">
                                <h5>Status</h5>
                                <p className="text-success">{review.status}</p>
                                <button className="btn btn-warning">
                                  <FontAwesomeIcon icon="pen" />
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    dispatch(deleteReview(review.id))
                                  }
                                >
                                  <FontAwesomeIcon icon="trash" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyReviews;
