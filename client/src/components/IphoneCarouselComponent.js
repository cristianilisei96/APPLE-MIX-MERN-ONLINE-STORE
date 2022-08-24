import React from "react";
import { useSelector, useDispatch } from "react-redux";

const IphoneCarouselComponent = () => {
  const products = useSelector((state) => state.products.item);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h5>iPhone for you</h5>
            <div
              id="carouselExampleControls"
              className="carousel-inner mb-4"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src="..." className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src="..." className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src="..." className="d-block w-100" alt="..." />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IphoneCarouselComponent;
