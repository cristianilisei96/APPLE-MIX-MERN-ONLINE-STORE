import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUsers } from "../../actions/usersActions";
import { getAdmins } from "../../actions/authActions";
import { getProducts } from "../../actions/productsActions";
import { getReviews } from "../../actions/reviewsActions";
import { getAllCategories } from "../../actions/categoryActions";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  const users = useSelector((state) => state.users.item);
  const admins = useSelector((state) => state.admins.item);
  const categories = useSelector((state) => state.categories.category);
  const products = useSelector((state) => state.products.item);
  const reviews = useSelector((state) => state.reviews.item);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tokenFromLocalStorage = localStorage.getItem("token");

  useEffect(() => {
    if (!tokenFromLocalStorage) {
      navigate("/login");
    } else {
      if (user && user.role_id !== 1) {
        console.log("nu e admin");
        navigate("/login");
      } else if (user && user.role_id === 1) {
        console.log("e admin");
        dispatch(getUsers());
        dispatch(getAdmins());
        dispatch(getAllCategories());
        dispatch(getProducts());
        dispatch(getReviews());
      }
    }
  }, [tokenFromLocalStorage, user, dispatch, navigate]);

  return (
    <>
      <Navbar />
      <div id="dashboardComponent">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="card bg-dark text-white">
                <div className="card-body p-5">
                  <div className="row align-items-center justify-content-between">
                    <div className="col">
                      <h2 className="text-success">
                        Welcome back, your dashboard is ready!
                      </h2>
                      <p className="text-gray-700">
                        Great job, your dashboard is ready to go! You can
                        create, update, delete the users, admins, products or
                        reviews, sales, generate links, prepare coupons, and
                        download affiliate reports using this dashboard.
                      </p>
                    </div>
                    <div className="col d-none d-lg-block mt-xxl-n4">
                      <img
                        className="img-fluid px-xl-4 mt-xxl-n5"
                        alt="nume"
                        src="/images/admin/dashboard.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row fw-bold">
            <div className="col-lg-3 mb-4">
              <Link to="/admin/dashboard/users">
                <div className="card bg-danger">
                  <div className="p-4">
                    <div className="float-start text-dark">
                      <h4>{users.length}</h4>
                      <p className="m-0">
                        {users.length < 2 ? "User" : "Users"}
                      </p>
                    </div>
                    <div className="float-end">
                      <FontAwesomeIcon
                        icon="users"
                        size="4x"
                        className="text-dark"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 mb-4">
              <Link to="/admin/dashboard/admins">
                <div className="card bg-success">
                  <div className="p-4">
                    <div className="float-start text-dark">
                      <h4 className="m-0">{admins.length}</h4>
                      <p className="m-0">
                        {admins.length < 2 ? "Admin" : "Admins"}
                      </p>
                    </div>
                    <div className="float-end">
                      <FontAwesomeIcon
                        icon="user-shield"
                        size="4x"
                        className="text-dark"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 mb-4">
              <Link to="/admin/dashboard/categories">
                <div className="card bg-primary">
                  <div className="p-4">
                    <div className="float-start text-dark">
                      <h4 className="m-0">{categories.length}</h4>
                      <p className="m-0">
                        {
                          (categories.length === 0 ? "Categories" : "",
                          categories.length <= 1 ? "Category" : "Categories")
                        }
                      </p>
                    </div>
                    <div className="float-end">
                      <FontAwesomeIcon
                        icon="tag"
                        size="4x"
                        className="text-dark"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 mb-4">
              <Link to="/admin/dashboard/products">
                <div className="card bg-warning">
                  <div className="card-block p-4">
                    <div className="float-start text-dark">
                      <h4>{products.length}</h4>
                      <p className="m-0">
                        {products.length < 2 ? "Product" : "Products"}
                      </p>
                    </div>
                    <div className="float-end">
                      <FontAwesomeIcon
                        icon="clone"
                        size="4x"
                        className="text-dark"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 mb-4">
              <Link to="/admin/dashboard/reviews">
                <div className="card bg-info">
                  <div className="p-4">
                    <div className="float-start text-dark">
                      <h4 className="m-0">{reviews.length}</h4>
                      <p className="m-0">
                        {reviews.length < 2 ? "Review" : "Reviews"}
                      </p>
                    </div>
                    <div className="float-end">
                      <FontAwesomeIcon
                        icon="comments"
                        size="4x"
                        className="text-dark"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            {/* de facut !! */}
            <div className="col-lg-3 mb-4">
              <Link to="/admin/dashboard/images">
                <div className="card bg-info">
                  <div className="p-4">
                    <div className="float-start text-dark">
                      <h4 className="m-0">{reviews.length}</h4>
                      <p className="m-0">
                        {reviews.length < 2 ? "Image" : "Images"}
                      </p>
                    </div>
                    <div className="float-end">
                      <FontAwesomeIcon
                        icon="image"
                        size="4x"
                        className="text-dark"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            {/* de facut end !! */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
