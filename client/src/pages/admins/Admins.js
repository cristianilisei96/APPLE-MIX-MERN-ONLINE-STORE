import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Admins = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const tokenFromLocalStorage = localStorage.getItem("token");

  useEffect(() => {
    if (!tokenFromLocalStorage) {
      navigate("/login");
    } else {
      if (user && user.role_id !== 1) {
        console.log("nu e admin");
        navigate("/");
      } else {
        console.log("este admin");
      }
    }
  }, [tokenFromLocalStorage, user]);

  return (
    <>
      <Navbar />
      <div id="adminsDashboard"></div>
      <Footer />
    </>
  );
};

export default Admins;
