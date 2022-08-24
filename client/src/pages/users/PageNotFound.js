import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div id="pageNotFoundComponent" className="bg-dark text-white">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <h3>
            4<span className="text-success">0</span>4 - PAGE NOT{" "}
            <span className="text-success">FOUND</span>
          </h3>
          <p>
            The page you are looking for might have been removed had it's name
            changed or is temporarily unavailable
          </p>
          <Link to="/" className="btn btn-success btn-lg fw-bold">
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
