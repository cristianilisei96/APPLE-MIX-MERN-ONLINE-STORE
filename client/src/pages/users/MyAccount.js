import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadingUserConnected } from "../../actions/authActions";
import SidebarUser from "../../components/SidebarUser";
import { useDispatch, useSelector } from "react-redux";
import { durationInYears } from "@progress/kendo-date-math";
import SimpleDateTime from "react-simple-timestamp-to-date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCurrentUserReviews } from "../../actions/reviewsActions";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Avatar from "react-avatar-edit";

const MyAccount = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const favorites = useSelector((state) => state.auth.favorites.items);
  const current_user_reviews = useSelector(
    (state) => state.reviews.currentUserReviews
  );
  const user = useSelector((state) => state.auth.user);

  const [modalAvatar, setModalAvatar] = useState({
    isOpen: false,
    src: null,
    preview: null,
  });

  const toggleModalAvatar = () => {
    setModalAvatar({
      ...modalAvatar,
      isOpen: !modalAvatar.isOpen,
      src: null,
      preview: null,
    });
  };

  const onClose = () => {
    setModalAvatar({
      ...modalAvatar,
      preview: null,
    });
  };

  const onCrop = (view) => {
    setModalAvatar({
      ...modalAvatar,
      preview: view,
    });
  };

  const submitCropedAvatar = () => {
    const formData = new FormData();
    formData.append("user_id", user ? user.id : null);
    formData.append("avatar", modalAvatar.preview);

    const post_new_avatar = () =>
      axios({
        method: "post",
        url: "/users/edit-avatar",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

    if (modalAvatar.preview) {
      post_new_avatar();
      toggleModalAvatar();
      dispatch(loadingUserConnected());
    } else {
      post_new_avatar();
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRegistrationDate = new Date(
    user ? user.created_at.substring(0, 4) : null,
    user ? user.created_at.substring(5, 7) : null,
    user ? user.created_at.substring(8, 10) : null
  );

  const currentDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );

  const durationSinceUserRegistration = durationInYears(
    userRegistrationDate,
    currentDate
  );

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("token");
    if (!tokenFromLocalStorage) {
      navigate("/login");
    }
    if (user) {
      dispatch(getCurrentUserReviews());
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  return (
    <>
      <Navbar />
      <div id="myAccountComponent">
        <div className="container">
          <div className="row">
            <SidebarUser />
            <div className="col-md-12 col-lg-9">
              <div className="card bg-dark text-white mb-4">
                <div className="card-body">
                  <h4>Account data</h4>
                  <div className="row justify-content-center align-items-center">
                    <div className="col-md-3 mb-4 mb-md-0 mb-lg-0">
                      {isAuthenticated ? (
                        <>
                          {user.avatar === "Need revision" ? (
                            <>
                              <div
                                className="text-center position-relative"
                                style={{ transition: "0.7s" }}
                              >
                                <>
                                  <p
                                    id="initials-rounded"
                                    className="bg-success text-dark fw-bold rounded-circle display-3 text-uppercase mb-0 imgUserAvatar"
                                    onClick={toggleModalAvatar}
                                  >
                                    {user.first_name.substring(0, 1)}{" "}
                                    {user.last_name.substring(0, 1)}
                                  </p>

                                  <p className="fw-bold mt-2 mb-0 text-on-hover">
                                    Click to change
                                  </p>
                                </>
                              </div>
                            </>
                          ) : (
                            <div
                              className="text-center position-relative"
                              style={{ transition: "0.7s" }}
                            >
                              <img
                                src={user.avatar}
                                alt={user.first_name + " " + user.last_name}
                                className="imgUserAvatar"
                                onClick={toggleModalAvatar}
                              />

                              <p className="fw-bold mt-2 mb-0 text-on-hover">
                                Click on photo to change
                              </p>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                    <div className="col-md-6 mb-4 mb-md-0 mb-lg-0">
                      {user ? (
                        <>
                          <div className="acountDataRow border-bottom d-flex justify-content-between py-3">
                            <div className="left">
                              <FontAwesomeIcon
                                icon="user-secret"
                                color="#198754"
                              />{" "}
                              <h6 className="d-inline m-0">Alias</h6>
                            </div>
                            <div className="right">
                              {user.alias === "Need revision" ? (
                                <Link
                                  to="/user/personaldata"
                                  className="text-danger text-decoration-none"
                                >
                                  <h6 className="m-0">Need revision</h6>
                                </Link>
                              ) : (
                                <h6 className="m-0">{user.alias}</h6>
                              )}
                            </div>
                          </div>
                          <div className="acountDataRow border-bottom d-flex justify-content-between py-3">
                            <div className="left">
                              <FontAwesomeIcon icon="user" color="#198754" />{" "}
                              <h6 className="d-inline m-0">Name</h6>
                            </div>
                            <div className="right">
                              <h6 className="m-0">
                                {user.first_name + " " + user.last_name}
                              </h6>
                            </div>
                          </div>
                          <div className="acountDataRow border-bottom d-flex justify-content-between py-3">
                            <div className="left">
                              <FontAwesomeIcon
                                icon="envelope"
                                color="#198754"
                              />{" "}
                              <h6 className="d-inline m-0">Email</h6>
                            </div>
                            <div className="right">
                              <h6 className="m-0">{user.email}</h6>
                            </div>
                          </div>
                          <div className="acountDataRow border-bottom d-flex justify-content-between py-3">
                            <div className="left">
                              <FontAwesomeIcon
                                icon="mobile-alt"
                                color="#198754"
                              />{" "}
                              Phone
                            </div>
                            <div className="right">
                              {user.phone === "Need revision" ? (
                                <Link
                                  to="/user/personaldata"
                                  className="text-danger text-decoration-none"
                                >
                                  <h6 className="m-0">Need revision</h6>
                                </Link>
                              ) : (
                                <h6 className="m-0">{user.phone}</h6>
                              )}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="col-md-3 mb-4 mb-md-0 mb-lg-0">
                      <div className="rounded-box text-center">
                        {durationSinceUserRegistration >= 1 ? (
                          <strong>
                            Thank you for being our customer for{" "}
                            {durationSinceUserRegistration === 1 ? (
                              <span className="text-success">
                                <strong className="d-block fs-4">
                                  {durationSinceUserRegistration} year
                                </strong>
                              </span>
                            ) : (
                              <span className="text-success">
                                <strong className="d-block fs-4">
                                  {durationSinceUserRegistration} years
                                </strong>
                              </span>
                            )}
                          </strong>
                        ) : (
                          <strong>
                            Thank you for being our customer since
                            <span className="text-success">
                              {user ? (
                                <>
                                  <strong className="d-block fs-4">
                                    <SimpleDateTime
                                      dateSeparator="-"
                                      showTime="0"
                                      dateFormat="DMY"
                                    >
                                      {user.created_at}
                                    </SimpleDateTime>
                                  </strong>
                                </>
                              ) : null}
                            </span>
                          </strong>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-success text-center p-0">
                  <Link
                    to="/user/personaldata"
                    className="fw-bold text-decoration-none text-dark link-dark d-block py-2"
                  >
                    Manage your data
                  </Link>
                </div>
              </div>
              <div className="card bg-dark text-white mb-4">
                <div className="card-body">
                  <h4>My activity</h4>
                  <div className="row justify-content-center align-items-center">
                    <div className="col-md-4 text-center mb-2">
                      <div className="d-flex justify-content-between p-2 shadow">
                        <div className="align-self-center">
                          <FontAwesomeIcon
                            icon="basket-shopping"
                            size="3x"
                            className="text-success"
                          />
                        </div>
                        <div className="text-end">
                          <h3>0</h3>
                          <p className="fw-bold mb-1">Orders</p>
                          <Link
                            to="/user/myorders"
                            className="text-decoration-none text-success fw-bold"
                          >
                            View order history
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-2">
                      <div className="d-flex justify-content-between p-2 shadow">
                        <div className="align-self-center">
                          <h3>{favorites.length}</h3>
                          <p className="fw-bold mb-1">Favorites</p>
                          <Link
                            to="/user/favorites"
                            className="text-decoration-none text-danger fw-bold"
                          >
                            See favorite products
                          </Link>
                        </div>
                        <div className="align-self-center text-end">
                          <FontAwesomeIcon
                            icon="heart"
                            size="3x"
                            className="text-danger"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-2">
                      <div className="d-flex justify-content-between p-2 shadow">
                        <div className="align-self-center">
                          <FontAwesomeIcon
                            icon="star"
                            size="3x"
                            className="text-warning"
                          />
                        </div>
                        <div className="text-end">
                          <h3>{current_user_reviews.length}</h3>
                          <p className="fw-bold mb-1">Reviews</p>
                          <Link
                            to="/user/myreviews"
                            className="text-decoration-none text-warning fw-bold"
                          >
                            See your reviews
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modalAvatar.isOpen} toggle={toggleModalAvatar}>
        <ModalHeader toggle={toggleModalAvatar} className="bg-dark text-white">
          Edit avatar
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            {modalAvatar.preview ? <h4>Crop your photo</h4> : null}
          </div>
          <Avatar
            className="avatar-component"
            width={"100%"}
            height={300}
            onCrop={onCrop}
            onClose={onClose}
            cropColor={"#198754"}
            closeIconColor={"#DC3644"}
            lineWidth={6}
          />
          {modalAvatar.preview ? (
            <>
              <div className="text-center mt-2">
                <h4>How it looks?</h4>
                <img
                  className="imgUserAvatar border-success border-2"
                  style={{ border: "2px solid #198754" }}
                  src={modalAvatar.preview}
                />
              </div>
            </>
          ) : null}
        </ModalBody>
        {modalAvatar.preview ? (
          <>
            <ModalFooter className="justify-content-center">
              <button
                className="btn btn-danger text-dark fw-bold"
                onClick={toggleModalAvatar}
              >
                <FontAwesomeIcon icon="thumbs-down" className="me-2" />
                Bad
              </button>
              <button
                className="btn btn-success text-dark fw-bold"
                onClick={() => submitCropedAvatar()}
              >
                <FontAwesomeIcon icon="thumbs-up" className="me-2" />
                Good
              </button>
            </ModalFooter>
          </>
        ) : null}
      </Modal>
      <Footer />
    </>
  );
};

export default MyAccount;
