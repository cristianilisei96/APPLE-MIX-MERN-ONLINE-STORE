import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar";
import { Alert } from "reactstrap";
import { register } from "../../actions/authActions";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors } from "../../actions/errorActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RegisterPage = () => {
  const [registerState, setRegisterState] = useState({
    role_id: 2,
    alias: "Need revision",
    avatar: "Need revision",
    first_name: "",
    last_name: "",
    email: "",
    phone: "Need revision",
    password: "",
    msg: null,
    alert: false,
    isSubscribed: false,
    password_hide: true,
  });

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const error = useSelector((state) => state.error);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onChange = (e) => {
    setRegisterState({ ...registerState, [e.target.name]: e.target.value });
  };

  const onEnterPressed = (e) => {
    e.preventDefault();

    if (e.key === "Enter" || e.keyCode === 13) {
      onSubmit(e);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      role_id: registerState.role_id,
      alias: registerState.alias,
      avatar: registerState.avatar,
      first_name: registerState.first_name,
      last_name: registerState.last_name,
      email: registerState.email,
      phone: registerState.phone,
      password: registerState.password,
    };

    dispatch(register(newUser));
  };

  useEffect(() => {
    if (error.id === "REGISTER_FAIL") {
      setRegisterState({ ...registerState, msg: error.msg.msg, alert: true });
    }
    if (isAuthenticated) {
      navigate("/");
    }
  }, [error, isAuthenticated, navigate]);

  return (
    <>
      <Navbar />
      <div id="registerFormComponent">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6 mb-4 mx-auto">
              <div
                className="card bg-dark text-white"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body p-5">
                  <div id="title-card" className="text-center">
                    <h2 className="text-uppercase text-success fw-bold mb-5">
                      Register
                    </h2>
                  </div>
                  {registerState.msg ? (
                    <Alert
                      color="danger"
                      className="mb-4"
                      isOpen={registerState.alert}
                      toggle={function noRefCheck() {
                        setRegisterState({
                          ...registerState,
                          alert: !registerState.alert,
                        });
                        dispatch(clearErrors());
                      }}
                    >
                      {registerState.msg}
                    </Alert>
                  ) : null}

                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      className="form-control form-control-lg"
                      placeholder="First Name"
                      value={registerState.first_name || ""}
                      onChange={onChange}
                      onKeyUp={onEnterPressed}
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      className="form-control form-control-lg"
                      placeholder="Last Name"
                      value={registerState.last_name || ""}
                      onChange={onChange}
                      onKeyUp={onEnterPressed}
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control form-control-lg"
                      placeholder="Email"
                      value={registerState.email || ""}
                      onChange={onChange}
                      onKeyUp={onEnterPressed}
                    />
                  </div>
                  <p className="text-success">{registerState.password_hide}</p>
                  <div className="input-group mb-4">
                    <input
                      type={registerState.password_hide ? "password" : "text"}
                      name="password"
                      id="password"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      value={registerState.password || ""}
                      onChange={onChange}
                      onKeyUp={onEnterPressed}
                    />
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        setRegisterState({
                          ...registerState,
                          password_hide: !registerState.password_hide,
                        })
                      }
                    >
                      {registerState.password_hide ? (
                        <FontAwesomeIcon icon="eye" className="my-auto" />
                      ) : (
                        <FontAwesomeIcon icon="eye-slash" className="my-auto" />
                      )}
                    </button>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-success btn-block btn-lg text-dark fw-bold"
                      onClick={onSubmit}
                    >
                      Register
                    </button>
                  </div>

                  <div className="redirectDiv">
                    <p className="text-center text-muted mt-5 mb-0">
                      You have an account?{" "}
                      <Link
                        to="/login"
                        className="text-success text-decoration-none fw-bold"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
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

export default RegisterPage;
