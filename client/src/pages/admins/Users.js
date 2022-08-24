import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../actions/usersActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../../components/Footer";
import {
  switchRoleToAdmin,
  switchRoleToUser,
  deleteUser,
} from "../../actions/usersActions";
import SimpleDateTime from "react-simple-timestamp-to-date";

const Users = () => {
  const error = useSelector((state) => state.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const users = useSelector((state) => state.users.item);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterMethod, setFilterMethod] = useState({
    searchTerm: "",
  });

  const tokenFromLocalStorage = localStorage.getItem("token");

  useEffect(() => {
    if (!tokenFromLocalStorage) {
      navigate("/login");
    } else {
      if (user && user.role_id !== 1) {
        navigate("/login");
      } else {
        dispatch(getUsers());
      }
    }
  }, [tokenFromLocalStorage, isAuthenticated, user, error, dispatch, navigate]);

  return (
    <>
      <Navbar />
      <div id="usersDashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="card border-dark">
                <div className="card-header bg-dark text-white">
                  <span className="fw-bold fs-4">
                    Users :{" "}
                    <span id="numberOfUsers" className="text-success">
                      {users.length}
                    </span>
                  </span>
                  <button
                    className="btn btn-success float-end"
                    // onClick={() => toggle()}
                  >
                    <FontAwesomeIcon icon="plus" />
                  </button>
                </div>

                <div className="card-body">
                  <h5 className="text-black">
                    Search for a user by first or last name, alias, email, phone
                    or role.
                  </h5>
                  <div className="filter position-relative">
                    <FontAwesomeIcon
                      icon="search"
                      className="icon text-success"
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Search a user.."
                      onChange={(e) =>
                        setFilterMethod({
                          ...filterMethod,
                          searchTerm: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="table-responsive">
                    <table
                      id="tableUsersDashboard"
                      className="table table-hover mb-0"
                    >
                      <thead>
                        <tr>
                          <th scope="col" style={{ minWidth: "80px" }}>
                            <FontAwesomeIcon icon="hashtag" />
                            ID
                          </th>
                          <th scope="col" style={{ minWidth: "100px" }}>
                            <FontAwesomeIcon icon="camera" /> Avatar
                          </th>
                          <th scope="col" style={{ minWidth: "130px" }}>
                            <FontAwesomeIcon icon="fingerprint" /> First Name
                          </th>
                          <th scope="col" style={{ minWidth: "130px" }}>
                            <FontAwesomeIcon icon="fingerprint" /> Last Name
                          </th>
                          <th scope="col" style={{ minWidth: "100px" }}>
                            <FontAwesomeIcon icon="user-secret" /> Alias
                          </th>
                          <th scope="col" style={{ minWidth: "150px" }}>
                            <FontAwesomeIcon icon="envelope" /> Email
                          </th>
                          <th scope="col" style={{ minWidth: "150px" }}>
                            <FontAwesomeIcon icon="mobile-alt" /> Phone
                          </th>
                          <th scope="col" style={{ minWidth: "80px" }}>
                            Role
                          </th>
                          <th scope="col" style={{ minWidth: "130px" }}>
                            <FontAwesomeIcon icon="calendar-alt" /> Created
                          </th>
                          <th scope="col" style={{ minWidth: "130px" }}>
                            <FontAwesomeIcon icon="pen" /> Updated
                          </th>
                          <th
                            scope="col"
                            style={{ minWidth: "100px" }}
                            className="text-end"
                          >
                            <FontAwesomeIcon icon="hand" /> Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter((val) => {
                            if (filterMethod.searchTerm === "") {
                              return val;
                            } else if (
                              val.alias
                                .toLowerCase()
                                .includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.alias
                                .toUpperCase()
                                .includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.first_name.includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.first_name
                                .toLowerCase()
                                .includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.last_name.includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.last_name
                                .toLowerCase()
                                .includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.email.includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.email
                                .toUpperCase()
                                .includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.phone.includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.role_name.includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.role_name
                                .toUpperCase()
                                .includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            } else if (
                              val.role_name
                                .toLowerCase()
                                .includes(filterMethod.searchTerm)
                            ) {
                              return val;
                            }
                          })
                          .map(
                            ({
                              id,
                              role_id,
                              role_name,
                              alias,
                              avatar,
                              first_name,
                              last_name,
                              email,
                              phone,
                              created_at,
                              updated_at,
                            }) => (
                              <tr key={id} className="align-middle">
                                <th scope="row">#{id}</th>
                                <th scope="row">
                                  {avatar === "Need revision" ? (
                                    <div
                                      className="mx-auto bg-success d-flex justify-content-center align-items-center text-uppercase"
                                      style={{
                                        width: 40,
                                        height: 40,
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        borderRadius: "50%",
                                      }}
                                    >
                                      {first_name.substring(0, 1)}
                                      {last_name.substring(0, 1)}
                                    </div>
                                  ) : (
                                    <img
                                      src={avatar}
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                      }}
                                      alt={
                                        user
                                          ? user.first_name +
                                            " " +
                                            user.last_name
                                          : null
                                      }
                                      className="mx-auto d-flex justify-content-center align-items-center"
                                    />
                                  )}
                                </th>
                                <th scope="row">{first_name}</th>
                                <th scope="row">{last_name}</th>
                                <th scope="row">{alias}</th>
                                <th scope="row">{email}</th>
                                <th scope="col">{phone}</th>
                                <th>
                                  {role_id === 1 ? (
                                    <button
                                      className="btn btn-success rounded-circle"
                                      style={{
                                        width: "44px",
                                        height: "44px",
                                      }}
                                      onClick={() =>
                                        dispatch(switchRoleToUser(id))
                                      }
                                    >
                                      <FontAwesomeIcon icon="shield-alt" />
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-info rounded-circle"
                                      style={{
                                        width: "44px",
                                        height: "44px",
                                      }}
                                      onClick={() =>
                                        dispatch(switchRoleToAdmin(id))
                                      }
                                    >
                                      <FontAwesomeIcon icon="user" />
                                    </button>
                                  )}
                                </th>
                                <th>
                                  <SimpleDateTime
                                    dateSeparator="-"
                                    showTime="0"
                                    dateFormat="DMY"
                                  >
                                    {created_at}
                                  </SimpleDateTime>
                                </th>
                                <th>
                                  <SimpleDateTime
                                    dateSeparator="-"
                                    showTime="0"
                                    dateFormat="DMY"
                                  >
                                    {updated_at}
                                  </SimpleDateTime>
                                </th>
                                <th>
                                  <button
                                    className="btn btn-warning"
                                    // onClick={() => toggleEditModal(id)}
                                  >
                                    <FontAwesomeIcon icon="pen" />
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => dispatch(deleteUser(id))}
                                  >
                                    <FontAwesomeIcon icon="trash-alt" />
                                  </button>
                                </th>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
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

export default Users;
