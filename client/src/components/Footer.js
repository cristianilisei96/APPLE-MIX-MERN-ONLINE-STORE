import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div id="footerComponent" className="bg-dark text-white footer-dark py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-11 col-xs-11 mb-4">
            <div className="footer-text pull-left">
              <div className="d-flex">
                <h1 className="fw-bold me-2 px-3 text-dark bg-success">
                  Apple
                </h1>
                <h1 className="fw-bold text-success"> Mix</h1>
              </div>
              <p className="card-text">
                We are an Apple Premium Reseller, Apple Premium Service
                Provider. We have over 35 years experience in supplying and
                supporting Apple technology.
              </p>
              <div className="social mt-2 mb-3">
                <i className="fa fa-facebook-official fa-lg"></i>
                <i className="fa fa-instagram fa-lg"></i>
                <i className="fa fa-twitter fa-lg"></i>
                <i className="fa fa-linkedin-square fa-lg"></i>
                <i className="fa fa-facebook"></i>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-sm-1 col-xs-1 mb-4"></div>
          <div className="col-md-2 col-sm-4 col-xs-4 mb-4">
            <h5 className="heading">Services</h5>
            <ul>
              <li>IT Consulting -</li>
              <li>Development</li>
              <li>Cloud</li>
              <li>DevOps & Support</li>
            </ul>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4 mb-4">
            <h5 className="heading">Industries</h5>
            <ul className="card-text">
              <li>Finance</li>
              <li>Public Sector</li>
              <li>Smart Office</li>
              <li>Retail</li>
            </ul>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-4">
            <h5 className="heading">Company</h5>
            <ul className="card-text">
              <li>About Us</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="row ">
          <div className="col-md-6 col-sm-6 col-xs-6 fs-5">
            <span>
              <i className="fa fa-copyright"></i> {new Date().getFullYear()}{" "}
              Apple Mix
            </span>
          </div>
          <div className="col-md-6 col-sm-6 col-xs-6 fs-5">
            <div className="d-flex flex-row-reverse">
              <Link
                to="/terms-of-use"
                className="px-2 text-decoration-none text-success"
              >
                Terms of Use
              </Link>
              <Link
                to="/privacy-policy"
                className="px-2 text-decoration-none text-success"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
