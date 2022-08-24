import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import SidebarUser from "../../components/SidebarUser";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router";

const MyOrders = () => {
  const navigate = useNavigate();

  const tokenFromLocalStorage = localStorage.getItem("token");
  useEffect(() => {
    if (!tokenFromLocalStorage) {
      navigate("/login");
    }
  }, [tokenFromLocalStorage]);
  return (
    <>
      <Navbar />
      <div id="myOrdersComponent">
        <div className="container">
          <div className="row">
            <SidebarUser />
            <div className="col-md-12 col-lg-9">
              <div className="card bg-dark text-white mb-4">
                <div className="card-body">
                  <h4>My orders</h4>
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

export default MyOrders;
