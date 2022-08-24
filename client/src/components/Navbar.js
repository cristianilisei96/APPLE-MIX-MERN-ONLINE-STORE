import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/authActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors } from "../actions/errorActions";

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.auth.favorites.items);
  const cart = useSelector((state) => state.auth.cart.items);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authLinks = (
    <li className="nav-item dropdown">
      <Link
        className="nav-link dropdown-toggle"
        to="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={() => dispatch(clearErrors())}
      >
        <FontAwesomeIcon icon="user" />
        <span className="d-none d-lg-inline"> My Account</span>
      </Link>
      <ul
        className="dropdown-menu bg-dark text-white"
        aria-labelledby="navbarDropdown"
      >
        <li className="headerDropdown">
          <p className="fw-bold m-0 px-3">
            {user && user.avatar === "Need revision" ? (
              <span>
                Hello, {user.first_name} {user.last_name}
              </span>
            ) : (
              <>
                <img
                  src={user ? user.avatar : null}
                  alt={user ? user.first_name + " " + user.last_name : null}
                  style={{}}
                  className="avatarToggleNavbar me-3"
                />
                {user ? `${user.first_name} ${user.last_name}` : ""}
              </>
            )}
          </p>
        </li>

        <hr className="dropdown-divider" />

        <li>
          <Link className="dropdown-item text-white" to="/user/myaccount">
            <FontAwesomeIcon icon="user" /> My Account
          </Link>
        </li>
        <li>
          <Link className="dropdown-item text-white" to="/user/favorites">
            <FontAwesomeIcon icon="heart" /> Favorites
          </Link>
        </li>

        {user && user.role_id === 1 ? (
          <>
            <li>
              <Link className="dropdown-item text-white" to="/admin/dashboard">
                <FontAwesomeIcon icon="gear" /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item text-white"
                to="/admin/dashboard/users"
              >
                <FontAwesomeIcon icon="users" /> Users
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item text-white"
                to="/admin/dashboard/admins"
              >
                <FontAwesomeIcon icon="user-shield" /> Admins
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item text-white"
                to="/admin/dashboard/categories"
              >
                <FontAwesomeIcon icon="tag" /> Categories
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item text-white"
                to="/admin/dashboard/products"
              >
                <FontAwesomeIcon icon="clone" /> Products
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item text-white"
                to="/admin/dashboard/reviews"
              >
                <FontAwesomeIcon icon="comments" /> Reviews
              </Link>
            </li>
          </>
        ) : (
          ""
        )}
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <p
            role="button"
            className="fw-bold m-0 px-3 cursor-pointer"
            onClick={() => dispatch(logout())}
          >
            <FontAwesomeIcon icon="sign-out-alt" /> Logout
          </p>
        </li>
      </ul>
    </li>
  );

  const guestLinks = (
    <li className="nav-item">
      <Link className="nav-link" to="/login">
        <FontAwesomeIcon icon="user" />
        <span className="d-none d-lg-inline"> My Account</span>
      </Link>
    </li>
  );

  const [searchState, setSearchState] = useState({
    searchTerm: "",
    firstNavBar: true,
    secondNavBar: false,
  });

  const functionSearchProduct = () => {
    navigate(`/search?search=${searchState.searchTerm}`);
    setSearchState({
      ...searchState,
      searchTerm: "",
      firstNavBar: true,
      secondNavBar: false,
    });
  };

  const onKeyUp = (e) => {
    e.preventDefault();

    if (e.key === "Enter" || e.keyCode === 13) {
      functionSearchProduct();
    }
  };

  return (
    <nav
      id="navbarComponent"
      className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark border-bottom border-success"
    >
      <div
        id="searchDiv"
        className={`container ${
          searchState.secondNavBar === true ? "d-block" : "d-none"
        }`}
      >
        <div className="row">
          <div className="d-flex align-items-center">
            <span
              onClick={() =>
                setSearchState({
                  ...searchState,
                  firstNavBar: true,
                  secondNavBar: false,
                })
              }
              className="btn mt-1 pt-0 pb-0"
            >
              <FontAwesomeIcon icon="times" size="2x" color="red" />
            </span>
            <input
              className="form-control rounded-start rounded-0"
              type="search"
              placeholder="Search"
              aria-label="Search"
              id="firstSearcInput"
              value={searchState.searchTerm}
              onChange={(e) =>
                setSearchState({ ...searchState, searchTerm: e.target.value })
              }
              onKeyUp={onKeyUp}
            />
            <button
              className="btn btn-success btn-block rounded-end rounded-0 text-dark"
              onClick={() => functionSearchProduct()}
            >
              <FontAwesomeIcon icon="search" />
            </button>
          </div>
        </div>
      </div>
      <div
        id="navbarDiv"
        className={`container ${
          searchState.firstNavBar === true ? "" : "d-none"
        }`}
      >
        <Link className="navbar-brand" to="/">
          <span className="fw-bold me-2 px-3 text-dark bg-success">Apple</span>
          <span className="fw-bold text-success">Mix</span>
          {/* Apple Mix */}
        </Link>
        <ul id="centerNavbar" className="navbar-nav ms-auto mb-0">
          <input
            type="search"
            className="form-control rounded-start rounded-0"
            placeholder="Search a product..."
            id="secondSearchInput"
            value={searchState.searchTerm}
            onChange={(e) =>
              setSearchState({ ...searchState, searchTerm: e.target.value })
            }
            onKeyUp={onKeyUp}
          />
          <button
            className="btn btn-success rounded-end rounded-0 text-dark"
            type="submit"
            onClick={() => functionSearchProduct()}
          >
            <FontAwesomeIcon icon="search" />
          </button>
        </ul>
        <ul className="navbar-nav ms-auto mb-0">
          <li className="nav-item d-lg-none">
            <span
              className="nav-link btn pb-0"
              onClick={() =>
                setSearchState({
                  ...searchState,
                  firstNavBar: false,
                  secondNavBar: true,
                })
              }
            >
              <FontAwesomeIcon icon="search" />
            </span>
          </li>
          {isAuthenticated ? authLinks : guestLinks}
          <li className="nav-item">
            <Link className="nav-link" to="/user/favorites">
              <FontAwesomeIcon icon="heart" />
              <span className="d-none d-lg-inline"> Favorites</span>
              {isAuthenticated ? (
                <span className="circleNotification bg-danger text-dark text-center fw-bold ms-1 rounded-pill">
                  {favorites.length}
                </span>
              ) : null}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/user/cart">
              <FontAwesomeIcon icon="shopping-cart" />
              <span className="d-none d-lg-inline"> Cart</span>
              {isAuthenticated ? (
                <span className="circleNotification bg-success text-dark text-center fw-bold ms-1 rounded-pill">
                  {cart.length}
                </span>
              ) : null}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
