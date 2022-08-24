import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import {
  changePassword,
  checkTokenIsValid,
} from "../../../actions/passwordActions";
import { Link, useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import { clearErrors } from "../../../actions/errorActions";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const ResetPasswordPage = () => {
  const error = useSelector((state) => state.error);
  const reset = useSelector((state) => state.passwords.reset);

  const navigate = useNavigate();

  const [resetState, setResetState] = useState({
    new_password: "",
    alert: false,
    msg: null,
  });

  const dispatch = useDispatch();
  const user_id = useParams().user_id;

  const token = {
    token: useParams().token,
  };

  const infoToUpdate = {
    user_id: user_id,
    new_password: resetState.new_password,
  };

  const onEnterPressed = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      dispatch(clearErrors());
      setResetState({
        ...resetState,
        msg: "",
      });
      dispatch(changePassword(infoToUpdate));
    }
  };

  const onSubmit = (e) => {
    dispatch(clearErrors());
    setResetState({
      ...resetState,
      msg: "",
    });
    dispatch(changePassword(infoToUpdate));
  };

  const [tokenIsValid, setTokenIsValid] = useState(true);

  useEffect(() => {
    if (error.id === "CHECK_IF_TOKEN_IS_NOT_EXPIRE_FAIL") {
      setTokenIsValid(false);
    }
    if (error.id === "CHANGE_PASSWORD_FAIL") {
      setResetState({
        ...resetState,
        msg: error.msg.msg,
        alert: true,
      });
      setTimeout(() => dispatch(clearErrors()), 5000);
    } else if (error.id === "CHECK_IF_TOKEN_IS_VALID_FAIl") {
      tokenIsValid = false;
    } else {
      setResetState({
        ...resetState,
        msg: "",
        alert: false,
      });
    }
    if (reset === "Password changed with success!") {
      navigate("/login");
    }
    if (tokenIsValid) {
      dispatch(checkTokenIsValid(token.token));
    }
  }, [error, reset, tokenIsValid]);

  return (
    <>
      <Navbar />
      {tokenIsValid ? (
        <>
          <div id="resetPasswordComponent">
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-9 col-lg-7 col-xl-6 mb-4 mx-auto text-center">
                  <div
                    className="card bg-dark text-white"
                    style={{ borderRadius: "15px" }}
                  >
                    <div className="card-body">
                      {resetState.msg ? (
                        <Alert
                          color="danger"
                          isOpen={resetState.alert}
                          toggle={function noRefCheck() {
                            setResetState({
                              ...resetState,
                              alert: false,
                            });
                            dispatch(clearErrors());
                          }}
                        >
                          {resetState.msg}
                        </Alert>
                      ) : null}
                      <FontAwesomeIcon icon="key" size="4x" className="mb-3" />
                      <h2 className="mb-3">Reset your password</h2>
                      <div className="mb-3">
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="New password"
                          value={resetState.new_password || ""}
                          onChange={(e) =>
                            setResetState({
                              ...resetState,
                              new_password: e.target.value,
                            })
                          }
                          onKeyUp={onEnterPressed}
                        />
                      </div>

                      <button
                        className="btn btn-lg btn-success mb-3 fw-bold"
                        onClick={onSubmit}
                      >
                        Change password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div id="resetPasswordComponent">
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-9 col-lg-7 col-xl-6 mb-4 mx-auto text-center">
                  <Alert color="danger" isOpen={true}>
                    This link is no longer available
                    <br />
                    Please resume the password{" "}
                    <Link to="/forgotyourpassword" className="text-success">
                      reset process
                    </Link>
                  </Alert>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </>
  );
};

export default ResetPasswordPage;
