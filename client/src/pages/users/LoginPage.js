import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar";
import { Alert } from "reactstrap";
import { login } from "../../actions/authActions";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors } from "../../actions/errorActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const error = useSelector((state) => state.error);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });

  const [alertState, setAlertState] = useState({
    alert: false,
    msg: null,
  });

  const [hidePassword, setHidePassword] = useState(true);

  const onChange = (e) => {
    setLoginState({ ...loginState, [e.target.name]: e.target.value });
  };

  const onEnterPressed = (e) => {
    e.preventDefault();

    if (e.key === "Enter" || e.keyCode === 13) {
      onSubmit(e);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const credential = {
      email: loginState.email,
      password: loginState.password,
    };

    // Attempt to login
    dispatch(login(credential));
  };

  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleChange = (event) => {
    if (event.target.checked) {
      console.log("✅ Checkbox is checked");
      localStorage.setItem("applemixemail", loginState.email);
      localStorage.setItem("applemixpassword", loginState.password);
      localStorage.setItem("applemixcheckbox", true);
    } else {
      console.log("⛔️ Checkbox is NOT checked");
      localStorage.removeItem("applemixemail");
      localStorage.removeItem("applemixpassword");
      localStorage.removeItem("applemixcheckbox");
    }
    setIsSubscribed((current) => !current);
  };

  const emailFromLocalStorage = localStorage.getItem("applemixemail");
  const passwordFromLocalStorage = localStorage.getItem("applemixpassword");
  const checkboxFromLocalSotrage = localStorage.getItem("applemixcheckbox");

  useEffect(() => {
    if (error.id === "LOGIN_FAIL") {
      setAlertState({
        ...alertState,
        alert: true,
        msg: error.msg.msg,
      });
      setTimeout(dispatch(clearErrors()), 5000);
      setTimeout(
        () =>
          setAlertState({
            ...alertState,
            alert: false,
            msg: "",
          }),
        5000
      );
    }
    if (isAuthenticated) {
      navigate("/");
    }
    if (checkboxFromLocalSotrage === "true") {
      setIsSubscribed(true);
      setLoginState({
        ...loginState,
        email: emailFromLocalStorage,
        password: passwordFromLocalStorage,
      });
    }
  }, [error, checkboxFromLocalSotrage, isAuthenticated, navigate]);

  return (
    <>
      <Navbar />

      <div id="loginFormComponent">
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
                      Log in
                    </h2>
                  </div>
                  {alertState.msg ? (
                    <Alert
                      className="mb-4"
                      color="danger"
                      isOpen={alertState.alert}
                      toggle={function noRefCheck() {
                        setAlertState({
                          ...alertState,
                          alert: false,
                          msg: "",
                        });
                        dispatch(clearErrors());
                      }}
                    >
                      {alertState.msg}
                    </Alert>
                  ) : null}

                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control form-control-lg"
                      placeholder="Email"
                      value={loginState.email || ""}
                      onChange={onChange}
                      onKeyUp={onEnterPressed}
                    />
                  </div>
                  <div className="input-group mb-4">
                    <input
                      type={hidePassword ? "password" : "text"}
                      name="password"
                      id="password"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      value={loginState.password || ""}
                      onChange={onChange}
                      onKeyUp={onEnterPressed}
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => setHidePassword(!hidePassword)}
                    >
                      {hidePassword ? (
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
                      Log in
                    </button>
                  </div>

                  <div className="mt-4 form-check d-flex justify-content-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={isSubscribed}
                      checked={isSubscribed}
                      onChange={handleChange}
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label cursor-pointer fw-bold ms-2"
                      htmlFor="flexCheckDefault"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="redirectDiv mt-4">
                    <p className="text-center text-muted mb-0">
                      <Link
                        to="/forgotyourpassword"
                        className="text-white text-decoration-none fw-bold"
                      >
                        Forgot your password?
                      </Link>
                    </p>

                    <p className="text-center text-muted mb-0">
                      Have not account yet?
                      <Link
                        to="/register"
                        className="text-success text-decoration-none fw-bold"
                      >
                        {" "}
                        Register
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

export default LoginPage;
