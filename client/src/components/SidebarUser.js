import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const SidebarUser = () => {
  const pathName = window.location.pathname;

  useEffect(() => {
    const myAccountLink = document.getElementById("myAccountLink");
    const myOrdersLink = document.getElementById("myOrdersLink");
    const myReviewsLink = document.getElementById("myReviewsLink");
    const myDataLink = document.getElementById("myDataLink");

    const newAttribute =
      "background : #198754 !important; border-color: #198754; color: #212529!important";

    if (pathName === "/user/myaccount") {
      myAccountLink.setAttribute("style", newAttribute);
    } else if (pathName === "/user/myorders") {
      myOrdersLink.setAttribute("style", newAttribute);
    } else if (pathName === "/user/myreviews") {
      myReviewsLink.setAttribute("style", newAttribute);
    } else if (pathName === "/user/personaldata") {
      myDataLink.setAttribute("style", newAttribute);
    }
  }, [pathName]);
  return (
    <>
      <div className="col-md-12 col-lg-3 mb-4">
        <div className="card bg-dark">
          <Link
            id="myAccountLink"
            to="/user/myaccount"
            className="list-group-item bg-dark text-white text-decoration-none fw-bold"
          >
            <h5 className="mb-0 fw-bold">
              <FontAwesomeIcon icon="user" /> My account
            </h5>
          </Link>

          <Link
            id="myOrdersLink"
            to="/user/myorders"
            className="list-group-item bg-dark text-white text-decoration-none fw-bold"
          >
            <h5 className="mb-0 fw-bold">
              <FontAwesomeIcon icon="coffee" /> My orders
            </h5>
          </Link>

          <Link
            id="myReviewsLink"
            to="/user/myreviews"
            className="list-group-item bg-dark text-white text-decoration-none fw-bold"
          >
            <h5 className="mb-0 fw-bold">
              <FontAwesomeIcon icon="comments" /> My reviews
            </h5>
          </Link>
          <Link
            id="myDataLink"
            to="/user/personaldata"
            className="list-group-item bg-dark text-white text-decoration-none fw-bold"
          >
            <h5 className="mb-0 fw-bold">
              <FontAwesomeIcon icon="database" /> My data
            </h5>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SidebarUser;
