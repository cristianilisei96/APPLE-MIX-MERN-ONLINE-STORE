import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import SidebarUser from "../../components/SidebarUser";
import Footer from "../../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  editUserPersonalData,
  postUserAddress,
  editUserAddress,
  tokenConfig,
} from "../../actions/authActions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert } from "reactstrap";
import { clearErrors, returnErrors } from "../../actions/errorActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const PersonalData = () => {
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.error);

  const navigate = useNavigate();

  const [personalData, setPersonalData] = useState({
    id: "",
    alias: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [personalDataState, setPersonalDataState] = useState({
    alert: false,
    msg: null,
  });

  const dispatch = useDispatch();

  const [userAddress, setUserAddress] = useState([]);

  const [newAddress, setNewAddress] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    county: "",
    town: "",
    address: "",
  });

  const [modalAddAddress, setModalAddAddress] = useState({
    isOpen: false,
    alert: false,
    msg: "",
  });

  const toggleModalAddAddress = () => {
    setModalAddAddress({
      ...modalAddAddress,
      isOpen: !modalAddAddress.isOpen,
      alert: false,
      msg: "",
    });

    setNewAddress({
      ...newAddress,
      user_id: user.id,
      first_name: "",
      last_name: "",
      phone: "",
      county: "",
      town: "",
      address: "",
    });
  };

  const [editAddress, setEditAddress] = useState({
    address_id: "",
    user_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    county: "",
    town: "",
    address: "",
  });

  const [modalEditAddAddress, setModalEditAddAddress] = useState({
    isOpen: false,
    alert: false,
    msg: "",
  });

  const toggleModalEditAddress = (address_id) => {
    setModalEditAddAddress({
      ...modalEditAddAddress,
      isOpen: !modalEditAddAddress.isOpen,
      alert: false,
      msg: "",
    });

    const selected_address = userAddress.filter(
      (address) => address.id === address_id
    );

    if (typeof address_id === "number") {
      setEditAddress({
        ...editAddress,
        address_id: address_id,
        user_id: user.id,
        first_name: selected_address[0].first_name,
        last_name: selected_address[0].last_name,
        phone: selected_address[0].phone,
        county: selected_address[0].county,
        town: selected_address[0].town,
        address: selected_address[0].address,
      });
    } else {
      setEditAddress({
        ...editAddress,
        address_id: "",
        user_id: "",
        first_name: "",
        last_name: "",
        phone: "",
        county: "",
        town: "",
        address: "",
      });
    }
  };

  const getUserPersonalData = () => (dispatch, getState) => {
    axios
      .get(`/users/get-user-personal-data`, tokenConfig(getState))
      .then((res) =>
        setPersonalData({
          ...personalData,
          id: res.data[0].id,
          alias: res.data[0].alias,
          first_name: res.data[0].first_name,
          last_name: res.data[0].last_name,
          email: res.data[0].email,
          phone: res.data[0].phone,
          role: res.data[0].role_name,
        })
      );
  };

  const getUserAddress = () => (dispatch, getState) => {
    axios
      .get(`/users/get-user-address`, tokenConfig(getState))
      .then((res) => setUserAddress(res.data))
      .catch((err) =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

  const deleteUserAddress = (address_id) => (dispatch, getState) => {
    setUserAddress(userAddress.filter((address) => address.id !== address_id));
    axios
      .delete(`/users/${address_id}/delete-user-address`, tokenConfig(getState))
      .catch((err) =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

  const onChangeNewAddress = (e) => {
    e.preventDefault();

    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeEditAddress = (e) => {
    e.preventDefault();

    setEditAddress({
      ...editAddress,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitNewAddress = (e) => {
    e.preventDefault();

    if (
      newAddress.first_name.length > 0 &&
      newAddress.last_name.length > 0 &&
      newAddress.phone.length > 0 &&
      newAddress.county.length > 0 &&
      newAddress.town.length > 0 &&
      newAddress.address.length > 0
    ) {
      dispatch(postUserAddress(newAddress));

      setModalAddAddress({
        ...modalAddAddress,
        isOpen: false,
        alert: false,
        msg: "",
      });

      dispatch(getUserAddress());
    } else {
      dispatch(postUserAddress(newAddress));
    }
  };

  const onSubmitEditAddress = (e) => {
    e.preventDefault();

    if (
      editAddress.first_name.length > 0 &&
      editAddress.last_name.length > 0 &&
      editAddress.phone.length > 0 &&
      editAddress.county.length > 0 &&
      editAddress.town.length > 0 &&
      editAddress.address.length > 0
    ) {
      dispatch(editUserAddress(editAddress));

      setModalEditAddAddress({
        ...modalEditAddAddress,
        isOpen: false,
        alert: false,
        msg: "",
      });

      dispatch(getUserAddress());
    } else {
      dispatch(editUserAddress(editAddress));
    }
  };

  const tokenFromLocalStorage = localStorage.getItem("token");

  useEffect(() => {
    if (!tokenFromLocalStorage) {
      navigate("/login");
    }
    if (user) {
      dispatch(getUserPersonalData());
      dispatch(getUserAddress());
    }

    if (error.id === "UPDATE_PERSONAL_DATA_FAIL") {
      setPersonalDataState({
        ...personalDataState,
        msg: error.msg.msg,
        alert: true,
      });
    }

    if (error.id === "POST_NEW_ADDRESS_FAIL") {
      setModalAddAddress({
        ...modalAddAddress,
        msg: error.msg.msg,
        alert: true,
      });
    }

    if (error.id === "UPDATE_ADDRESS_FAIL") {
      setModalEditAddAddress({
        ...modalEditAddAddress,
        msg: error.msg.msg,
        alert: true,
      });
    }
  }, [tokenFromLocalStorage, user, error]);

  return (
    <>
      <Navbar />
      <div id="personalDataComponent">
        <div className="container">
          <div className="row">
            <SidebarUser />
            <div className="col-md-12 col-lg-9 mb-4">
              <div className="card bg-dark text-white mb-4">
                <div className="card-body">
                  <h4>Personal data</h4>
                  <div className="row">
                    <div className="col-md-12">
                      {personalDataState.msg ? (
                        <Alert
                          color="danger"
                          isOpen={personalDataState.alert}
                          toggle={function noRefCheck() {
                            setPersonalDataState({
                              ...personalDataState,
                              alert: !personalDataState.alert,
                            });
                            dispatch(clearErrors());
                          }}
                        >
                          {personalDataState.msg}
                        </Alert>
                      ) : null}
                    </div>
                    <div className="col-md-6">
                      <div className="mb-2">
                        <label
                          htmlFor="aliasInput"
                          className={
                            user && user.alias === "Need revision"
                              ? "fw-bold text-danger mb-2"
                              : "fw-bold mb-2"
                          }
                        >
                          Alias
                        </label>
                        <input
                          type="text"
                          id="aliasInput"
                          value={personalData.alias || ""}
                          onChange={(e) =>
                            setPersonalData({
                              ...personalData,
                              alias: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="firstNameInput"
                          className="fw-bold mb-2"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstNameInput"
                          value={personalData.first_name || ""}
                          onChange={(e) =>
                            setPersonalData({
                              ...personalData,
                              first_name: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="lastNameInput" className="fw-bold mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastNameInput"
                          value={personalData.last_name || ""}
                          onChange={(e) =>
                            setPersonalData({
                              ...personalData,
                              last_name: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-2">
                        <label htmlFor="emailInput" className="fw-bold mb-2">
                          Email
                        </label>
                        <input
                          type="text"
                          id="emailInput"
                          value={personalData.email || ""}
                          onChange={(e) =>
                            setPersonalData({
                              ...personalData,
                              email: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="phoneInput"
                          className={
                            user && user.phone === "Need revision"
                              ? "fw-bold text-danger mb-2"
                              : "fw-bold mb-2"
                          }
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          id="phoneInput"
                          value={personalData.phone || ""}
                          onChange={(e) =>
                            setPersonalData({
                              ...personalData,
                              phone: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="roleInput" className="fw-bold mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          id="roleInput"
                          value={personalData.role || ""}
                          onChange={() => {}}
                          className="form-control bg-dark text-white"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <button
                        type="submit"
                        className="btn btn-success text-dark fw-bold"
                        onClick={() => {
                          const { role, ...newPersonalData } = personalData;
                          dispatch(editUserPersonalData(newPersonalData));
                        }}
                      >
                        <FontAwesomeIcon icon="pen" className="me-2 " /> Update
                        your personal data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-dark text-white mb-4">
                <div className="card-body">
                  <h4>Address</h4>

                  {userAddress.length === 0 ? (
                    <>
                      <p className="fw-bold text-success">
                        You have not added any address yet. Use the button below
                        to add a new address.
                      </p>
                      <button
                        className="btn btn-success text-dark fw-bold"
                        onClick={(e) => toggleModalAddAddress(e)}
                      >
                        <FontAwesomeIcon icon="plus" className="me-2" /> Add
                        address
                      </button>
                    </>
                  ) : (
                    <>
                      {userAddress.map((address) => (
                        <div
                          key={address.id}
                          className="address-row-class py-2 d-flex justify-content-between align-items-center border-bottom border-success"
                        >
                          <div className="user-address">
                            <span className="fw-bold text-success d-block">
                              {address.first_name} {address.last_name} -{" "}
                              {address.phone}
                            </span>
                            <span className="d-block">{address.address}</span>
                            <span className="d-block">
                              {address.county}, {address.town}
                            </span>
                          </div>
                          <div className="actions-user-address">
                            <button
                              className="btn btn-warning"
                              onClick={() => toggleModalEditAddress(address.id)}
                            >
                              <FontAwesomeIcon icon="pen" />
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                dispatch(deleteUserAddress(address.id))
                              }
                            >
                              <FontAwesomeIcon icon="trash-alt" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        className="btn btn-success text-dark fw-bold mt-4"
                        onClick={(e) => toggleModalAddAddress(e)}
                      >
                        <FontAwesomeIcon icon="plus" className="me-2" /> Add
                        address
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modalAddAddress.isOpen} toggle={toggleModalAddAddress}>
        <ModalHeader
          toggle={toggleModalAddAddress}
          className="bg-dark text-white"
        >
          Add a new delivery address
        </ModalHeader>
        <ModalBody>
          {modalAddAddress.msg ? (
            <Alert
              color="danger"
              className="mb-4"
              isOpen={modalAddAddress.alert}
              toggle={function noRefCheck() {
                setModalAddAddress({
                  ...modalAddAddress,
                  alert: !modalAddAddress.alert,
                });
                dispatch(clearErrors());
              }}
            >
              {modalAddAddress.msg}
            </Alert>
          ) : null}
          <h5>Contact person</h5>

          <div className="mb-2">
            <label htmlFor="first_name">First name</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              className="form-control"
              value={newAddress.first_name || ""}
              onChange={onChangeNewAddress}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="last_name">Last name</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              className="form-control"
              value={newAddress.last_name || ""}
              onChange={onChangeNewAddress}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="form-control"
              value={newAddress.phone || ""}
              onChange={onChangeNewAddress}
            />
          </div>
          <h5 className="mt-3">Delivery address</h5>
          <div className="mb-2">
            <label htmlFor="county">County</label>
            <input
              type="text"
              name="county"
              id="county"
              className="form-control"
              value={newAddress.county || ""}
              onChange={onChangeNewAddress}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="town">Town</label>
            <input
              type="text"
              name="town"
              id="town"
              className="form-control"
              value={newAddress.town || ""}
              onChange={onChangeNewAddress}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              className="form-control"
              value={newAddress.address || ""}
              onChange={onChangeNewAddress}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-dark fw-bold" onClick={onSubmitNewAddress}>
            Add
          </button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={modalEditAddAddress.isOpen}
        toggle={toggleModalEditAddress}
      >
        <ModalHeader
          toggle={toggleModalEditAddress}
          className="bg-dark text-white"
        >
          Edit the current address
        </ModalHeader>
        <ModalBody>
          {modalEditAddAddress.msg ? (
            <Alert
              color="danger"
              className="mb-4"
              isOpen={modalEditAddAddress.alert}
              toggle={function noRefCheck() {
                setModalEditAddAddress({
                  ...modalEditAddAddress,
                  alert: !modalEditAddAddress.alert,
                });
                dispatch(clearErrors());
              }}
            >
              {modalEditAddAddress.msg}
            </Alert>
          ) : null}
          <h5>Contact person</h5>

          <div className="mb-2">
            <label htmlFor="first_name">First name</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              className="form-control"
              value={editAddress.first_name || ""}
              onChange={onChangeEditAddress}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="last_name">Last name</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              className="form-control"
              value={editAddress.last_name || ""}
              onChange={onChangeEditAddress}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="form-control"
              value={editAddress.phone || ""}
              onChange={onChangeEditAddress}
            />
          </div>
          <h5 className="mt-3">Delivery address</h5>
          <div className="mb-2">
            <label htmlFor="county">County</label>
            <input
              type="text"
              name="county"
              id="county"
              className="form-control"
              value={editAddress.county || ""}
              onChange={onChangeEditAddress}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="town">Town</label>
            <input
              type="text"
              name="town"
              id="town"
              className="form-control"
              value={editAddress.town || ""}
              onChange={onChangeEditAddress}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              className="form-control"
              value={editAddress.address || ""}
              onChange={onChangeEditAddress}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-dark fw-bold"
            onClick={onSubmitEditAddress}
          >
            Edit
          </button>
        </ModalFooter>
      </Modal>
      <Footer />
    </>
  );
};

export default PersonalData;
