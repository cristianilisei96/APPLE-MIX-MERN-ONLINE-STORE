import React from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const Images = ({ number, suit }) => {
  function importAll(r) {
    let images = {};
    r.keys().forEach((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  const images = importAll(
    require.context("/public/images/products", false, /\.(png|jpe?g|svg)$/)
  );

  console.log(images);

  return (
    <>
      <Navbar />
      <div id="imagesDashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <img
                src={images["iphone_13_pro_max.png"]}
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Images;
