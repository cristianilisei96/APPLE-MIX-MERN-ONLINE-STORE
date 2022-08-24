import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getReviews,
  moderateReview,
  unmoderateReview,
  deleteReview,
  deleteReviews,
} from "../../actions/reviewsActions";
import { useNavigate, Link } from "react-router-dom";
import SimpleDateTime from "react-simple-timestamp-to-date";

const Reviews = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const reviews = useSelector((state) => state.reviews.item);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterMethod, setFilterMethod] = useState({
    searchTerm: "",
  });

  const tokenFromLocalStorage = localStorage.getItem("token");

  useEffect(() => {
    if (!tokenFromLocalStorage) {
      navigate("/login");
    } else {
      if (user && user.role_id !== 1) {
        console.log("nu e admin");
        navigate("/login");
      } else {
        console.log("este admin");
        dispatch(getReviews());
      }
    }
  }, [tokenFromLocalStorage, isAuthenticated, user, dispatch, navigate]);

  return (
    <div>
      <Navbar />
      <div id="reviewsDashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="card border-dark">
                <div className="card-header bg-dark text-white">
                  <span className="fw-bold fs-4">
                    {reviews.length === 1 ? "Review" : "Reviews"} :{" "}
                    <span id="numberOfReviews" className="text-success">
                      {reviews.length}
                    </span>
                  </span>
                  {reviews.length > 0 ? (
                    <div className="float-end">
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          window.confirm(
                            "Do you really want to delete all reviews?"
                          )
                            ? dispatch(deleteReviews())
                            : null
                        }
                      >
                        <FontAwesomeIcon icon="eraser" />
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="card-body">
                  {reviews.length === 0 ? (
                    <p className="m-0">There are currently no reviews</p>
                  ) : (
                    <>
                      <h5 className="text-black">
                        Search for a review by product name, first or last name
                        of user, message or active/pending word.
                      </h5>
                      <div className="filter position-relative">
                        <FontAwesomeIcon
                          icon="search"
                          className="icon text-success"
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Search a review.."
                          onChange={(e) =>
                            setFilterMethod({
                              ...filterMethod,
                              searchTerm: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="table-responsive">
                        <table
                          id="tableReviewsDashboard"
                          className="table table-hover mb-0"
                        >
                          <thead>
                            <tr>
                              <th scope="col" style={{ minWidth: "80px" }}>
                                <FontAwesomeIcon icon="hashtag" />
                                ID
                              </th>
                              <th scope="col" style={{ minWidth: "150px" }}>
                                <FontAwesomeIcon icon="camera" /> Product Image
                              </th>
                              <th scope="col" style={{ minWidth: "180px" }}>
                                <FontAwesomeIcon icon="fingerprint" /> Product
                                Name
                              </th>
                              <th scope="col" style={{ minWidth: "130px" }}>
                                <FontAwesomeIcon icon="user" /> User
                              </th>
                              <th scope="col" style={{ minWidth: "110px" }}>
                                <FontAwesomeIcon icon="star" /> Rating
                              </th>
                              <th scope="col" style={{ minWidth: "110px" }}>
                                <FontAwesomeIcon icon="face-meh-blank" />{" "}
                                Feeling
                              </th>
                              <th scope="col" style={{ minWidth: "350px" }}>
                                <FontAwesomeIcon icon="comment" /> Message
                              </th>
                              <th scope="col" style={{ minWidth: "82px" }}>
                                <FontAwesomeIcon icon="clock" /> Status
                              </th>
                              <th scope="col">
                                <FontAwesomeIcon icon="calendar-alt" /> Created
                              </th>
                              <th scope="col">
                                <FontAwesomeIcon icon="pen" /> Updated
                              </th>
                              <th
                                scope="col"
                                style={{ minWidth: "100px" }}
                                className="text-end"
                              >
                                <FontAwesomeIcon icon="hand" /> Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviews
                              .filter((val) => {
                                if (filterMethod.searchTerm === "") {
                                  return val;
                                } else if (
                                  val.product_name
                                    .toLowerCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                } else if (
                                  val.product_name
                                    .toUpperCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                } else if (
                                  val.first_name
                                    .toLowerCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                } else if (
                                  val.first_name
                                    .toUpperCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                } else if (
                                  val.last_name
                                    .toLowerCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                } else if (
                                  val.last_name
                                    .toUpperCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                } else if (
                                  val.message
                                    .toLowerCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                } else if (
                                  val.message
                                    .toUpperCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                } else if (
                                  val.status
                                    .toLowerCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                } else if (
                                  val.status
                                    .toUpperCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                }
                              })
                              .map((review) => (
                                <tr key={review.id} className="align-middle">
                                  <th scope="row">#{review.id}</th>
                                  <th>
                                    <Link to={`/product/${review.product_id}`}>
                                      <img
                                        src={review.product_image}
                                        style={{ width: "100px" }}
                                        alt={review.product_name}
                                      />
                                    </Link>
                                  </th>
                                  <th>
                                    <Link
                                      to={`/product/${review.product_id}`}
                                      className="text-black text-decoration-none"
                                    >
                                      {review.product_name}
                                    </Link>
                                  </th>
                                  <th>
                                    {review.first_name} {review.last_name}
                                  </th>
                                  <th>
                                    {review.rating === 1 ? (
                                      <>
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {review.rating === 2 ? (
                                      <>
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {review.rating === 3 ? (
                                      <>
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {review.rating === 4 ? (
                                      <>
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {review.rating === 5 ? (
                                      <>
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                        <FontAwesomeIcon
                                          icon="star"
                                          color="#fcea10"
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </th>
                                  <th>{review.rating_text}</th>
                                  <th>{review.message}</th>
                                  <th scope="col">
                                    {review.status === "active" ? (
                                      <button
                                        className="btn btn-success rounded-circle"
                                        style={{
                                          width: "44px",
                                          height: "44px",
                                        }}
                                        onClick={() =>
                                          dispatch(unmoderateReview(review.id))
                                        }
                                      >
                                        <FontAwesomeIcon icon="eye" />
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-danger rounded-circle"
                                        style={{
                                          width: "44px",
                                          height: "44px",
                                        }}
                                        onClick={() =>
                                          dispatch(moderateReview(review.id))
                                        }
                                      >
                                        <FontAwesomeIcon icon="eye-slash" />
                                      </button>
                                    )}
                                  </th>
                                  <th scope="col" style={{ minWidth: "125px" }}>
                                    <span className="d-block">
                                      <SimpleDateTime
                                        dateSeparator="-"
                                        showTime="0"
                                        dateFormat="DMY"
                                      >
                                        {review.created_at}
                                      </SimpleDateTime>
                                    </span>
                                    <span className="d-block">
                                      <SimpleDateTime
                                        timeSeparator=":"
                                        showDate="0"
                                        meridians="1"
                                      >
                                        {review.created_at}
                                      </SimpleDateTime>
                                    </span>
                                  </th>
                                  <th scope="col" style={{ minWidth: "125px" }}>
                                    <span className="d-block">
                                      <SimpleDateTime
                                        dateSeparator="-"
                                        showTime="0"
                                        dateFormat="DMY"
                                      >
                                        {review.updated_at}
                                      </SimpleDateTime>
                                    </span>
                                    <span className="d-block">
                                      <SimpleDateTime
                                        timeSeparator=":"
                                        showDate="0"
                                        meridians="1"
                                      >
                                        {review.updated_at}
                                      </SimpleDateTime>
                                    </span>
                                  </th>

                                  <th>
                                    <button
                                      className="btn btn-warning"
                                      // onClick={() => toggleEditModal(review.id)}
                                    >
                                      <FontAwesomeIcon icon="pen" />
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        dispatch(deleteReview(review.id))
                                      }
                                    >
                                      <FontAwesomeIcon icon="trash-alt" />
                                    </button>
                                  </th>
                                </tr>
                              ))}
                          </tbody>
                        </table>
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
    </div>
  );
};

export default Reviews;
