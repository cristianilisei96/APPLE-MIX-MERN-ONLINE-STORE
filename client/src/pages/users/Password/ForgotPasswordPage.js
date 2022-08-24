import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "reactstrap";
import { clearErrors } from "../../../actions/errorActions";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../../../components/Footer";
import {
  forgotPassword,
  clearRecoverMessage,
} from "../../../actions/passwordActions";

const ForgotPasswordPage = () => {
  const error = useSelector((state) => state.error);
  let recover = useSelector((state) => state.passwords.recover);

  const [state, setState] = useState({
    email: "",
    alert: false,
    alertRecoverSuccess: false,
    msg: null,
  });

  const dispatch = useDispatch();

  const recoverPassword = {
    email: state.email,
  };

  const onEnterPressed = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      onSubmit(e);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(forgotPassword(recoverPassword));
  };

  useEffect(() => {
    if (error.id === "RECOVER_FAIL") {
      setState({
        ...state,
        msg: error.msg.msg,
        alert: true,
        alertRecoverSuccess: false,
      });
      setTimeout(() => dispatch(clearErrors()), 5000);
    }
    if (error.id !== "RECOVER_FAIL") {
      setState({
        ...state,
        alert: false,
        alertRecoverSuccess: false,
        msg: "",
      });
    }
    if (recover === "Email exist in database!") {
      setState({
        ...state,
        alert: false,
        alertRecoverSuccess: true,
        msg: "Please check your email and click on the provided link to reset your password",
      });

      setTimeout(
        () =>
          setState({
            ...state,
            alert: false,
            alertRecoverSuccess: false,
            msg: "",
          }),
        5000
      );

      setTimeout(() => dispatch(clearRecoverMessage()), 5000);
    }
  }, [dispatch, error, recover]);

  return (
    <>
      <Navbar />
      <div id="forgotPasswordComponent">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6 mb-4 mx-auto text-center">
              <div
                className="card bg-dark text-white"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body">
                  {state.msg ? (
                    <>
                      <Alert
                        color="danger"
                        isOpen={state.alert}
                        toggle={function noRefCheck() {
                          setState({
                            ...state,
                            alert: false,
                          });
                          dispatch(clearErrors());
                        }}
                      >
                        {state.msg}
                      </Alert>
                      <Alert
                        color="success"
                        isOpen={state.alertRecoverSuccess}
                        toggle={function noRefCheck() {
                          setState({
                            ...state,
                            alertRecoverSuccess: false,
                          });
                          dispatch(clearErrors());
                        }}
                      >
                        {state.msg}
                      </Alert>
                    </>
                  ) : null}
                  <FontAwesomeIcon icon="key" size="4x" className="mt-2 mb-3" />
                  <h2 className="mb-3">Forgot password?</h2>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="floatingInput"
                      placeholder="Email address"
                      value={state.email}
                      onChange={(e) =>
                        setState({
                          ...state,
                          email: e.target.value,
                        })
                      }
                      onKeyUp={onEnterPressed}
                    />
                  </div>

                  <button
                    className="btn btn-lg btn-success mb-3 fw-bold d-block mx-auto"
                    type="submit"
                    onClick={() => {
                      dispatch(
                        forgotPassword({
                          email: state.email,
                        })
                      );
                    }}
                  >
                    Reset password
                  </button>
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

export default ForgotPasswordPage;
