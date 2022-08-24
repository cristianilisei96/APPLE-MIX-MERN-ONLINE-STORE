import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  getAllCategories,
  addNewCategory,
  editCategory,
  clearMsgFromCategories,
  deleteCategory,
} from "../../actions/categoryActions";
import { clearErrors } from "../../actions/errorActions";
import { useNavigate } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { Alert } from "reactstrap";
import { connect } from "react-redux";
import SimpleDateTime from "react-simple-timestamp-to-date";

const iconList = Object.keys(Icons)
  .filter((key) => key !== "fas" && key !== "prefix")
  .map((icon) => Icons[icon]);

library.add(...iconList);

const Categories = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const categories = useSelector((state) => state.categories.category);

  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.error);
  const msgFromCategoriesState = useSelector((state) => state.categories.msg);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalAddNewCategoryState, setModalAddNewCategoryState] = useState({
    isOpen: false,
    alert: false,
    msg: null,
    searchTerm: "",
  });

  const [newCategoryState, setNewCategoryState] = useState({
    category_name: "",
    slug_name: "",
    icon: null,
  });

  const toggleModalAddNewCategory = () => {
    dispatch(clearErrors());
    setModalAddNewCategoryState({
      ...modalAddNewCategoryState,
      isOpen: !modalAddNewCategoryState.isOpen,
    });
    setNewCategoryState({
      category_name: "",
      slug_name: "",
      icon: null,
    });
  };

  const attendToAddNewCategory = () => {
    dispatch(addNewCategory(newCategoryState));
    if (error.status === null) {
      setNewCategoryState({
        category_name: "",
        slug_name: "",
        icon: null,
      });
    }
  };

  const [modalEditCategory, setModalEditCategory] = useState({
    isOpen: false,
    alert: false,
    msg: null,
    searchTerm: "",
  });

  const [updatedCategory, setUpdatedCategory] = useState({
    category_id: "",
    category_name: "",
    slug_name: "",
    icon: null,
  });

  const toggleModalEditCategory = () => {
    dispatch(clearErrors());
    setModalEditCategory({
      ...modalEditCategory,
      isOpen: !modalEditCategory.isOpen,
      searchTerm: "",
    });
  };

  const attendToEditCategory = () => {
    // dispatch(clearErrors());
    dispatch(editCategory(updatedCategory));
    // setUpdatedCategory({
    //   category_id: "",
    //   category_name: "",
    //   slug_name: "",
    //   icon: null,
    // });
  };

  const [filterMethod, setFilterMethod] = useState({
    searchTerm: "",
  });

  const tokenFromLocalStorage = localStorage.getItem("token");

  useEffect(() => {
    if (!tokenFromLocalStorage) {
      navigate("/login");
    } else {
      if (user && user.role_id !== 1) {
        console.log("nu e admin");
        navigate("/login");
      } else {
        console.log("este admin");
        dispatch(getAllCategories());
      }
    }

    if (error.id === "ADMIN_ADD_NEW_CATEGORY_FAIL") {
      setModalAddNewCategoryState({
        ...modalAddNewCategoryState,
        alert: true,
        msg: error.msg.msg,
      });
    } else {
      setModalAddNewCategoryState({ ...modalAddNewCategoryState, msg: null });
    }
    if (error.id === "ADMIN_EDITED_CATEGORY_FAIL") {
      setModalEditCategory({
        ...modalEditCategory,
        alert: true,
        msg: error.msg.msg,
      });
    } else {
      setModalEditCategory({
        ...modalEditCategory,
        msg: null,
      });
    }
    if (msgFromCategoriesState === "The category was updated with success!") {
      setModalEditCategory({
        ...modalEditCategory,
        isOpen: !modalEditCategory.isOpen,
      });
      dispatch(clearMsgFromCategories());
    }
    if (msgFromCategoriesState === "The category was created with success!") {
      setModalAddNewCategoryState({
        ...modalAddNewCategoryState,
        isOpen: !modalAddNewCategoryState.isOpen,
      });
      dispatch(clearMsgFromCategories());
    }
  }, [
    isAuthenticated,
    user,
    dispatch,
    navigate,
    error,
    msgFromCategoriesState,
  ]);

  return (
    <>
      <Navbar />
      <div id="categoriesDashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="card border-dark">
                <div className="card-header bg-dark text-white">
                  <span className="fw-bold fs-4">
                    {categories.length === 1 ? "Category" : "Categories"} :{" "}
                    <span className="text-success">{categories.length}</span>
                  </span>
                  <div className="float-end">
                    <button
                      className="btn btn-success"
                      onClick={() => toggleModalAddNewCategory()}
                    >
                      <FontAwesomeIcon icon="plus" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {categories.length === 0 ? (
                    <p className="m-0">There are currently no categories</p>
                  ) : (
                    <>
                      <h5 className="text-black">
                        Search for a category by name, name displayed or icon
                        name.
                      </h5>
                      <div className="filter position-relative">
                        <FontAwesomeIcon
                          icon="search"
                          className="icon text-success"
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Search a category.."
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
                          id="tableCategoriesDashboard"
                          className="table table-hover mb-0"
                        >
                          <thead>
                            <tr>
                              <th scope="col" style={{ minWidth: "80px" }}>
                                <FontAwesomeIcon icon="hashtag" />
                                ID
                              </th>
                              <th scope="col">Category name</th>
                              <th scope="col">Name Displayed</th>
                              <th scope="col">Icon</th>
                              <th scope="col">Icon Name</th>
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
                            {categories
                              .filter((val) => {
                                if (filterMethod.searchTerm === "") {
                                  return val;
                                } else if (
                                  val.category_name.includes(
                                    filterMethod.searchTerm
                                  )
                                ) {
                                  return val;
                                } else if (
                                  val.slug_name.includes(
                                    filterMethod.searchTerm
                                  )
                                ) {
                                  return val;
                                } else if (
                                  val.icon.includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                }
                              })
                              .map((category) => (
                                <tr key={category.id} className="align-middle">
                                  <th scope="row">{category.id}</th>
                                  <th>{category.category_name}</th>
                                  <th>{category.slug_name}</th>
                                  <th className="text-center">
                                    <FontAwesomeIcon
                                      icon={category.icon}
                                      size="2x"
                                    />
                                  </th>
                                  <th>{category.icon}</th>
                                  <th>
                                    <SimpleDateTime
                                      timeSeparator=":"
                                      timeFormat="HMS"
                                      showTime="1"
                                      showDate="0"
                                      meridians="1"
                                    >
                                      {category.created_at}
                                    </SimpleDateTime>
                                    {" - "}
                                    <SimpleDateTime
                                      dateSeparator="."
                                      showTime="0"
                                      dateFormat="DMY"
                                    >
                                      {category.created_at}
                                    </SimpleDateTime>
                                  </th>
                                  <th>
                                    <SimpleDateTime
                                      timeSeparator=":"
                                      timeFormat="HMS"
                                      showTime="1"
                                      showDate="0"
                                      meridians="1"
                                    >
                                      {category.updated_at}
                                    </SimpleDateTime>
                                    {" - "}
                                    <SimpleDateTime
                                      dateSeparator="."
                                      showTime="0"
                                      dateFormat="DMY"
                                    >
                                      {category.updated_at}
                                    </SimpleDateTime>
                                  </th>
                                  <th>
                                    <button
                                      className="btn btn-warning"
                                      onClick={() => {
                                        toggleModalEditCategory();
                                        setUpdatedCategory({
                                          category_id: category.id,
                                          category_name: category.category_name,
                                          slug_name: category.slug_name,
                                          icon: category.icon,
                                        });
                                      }}
                                    >
                                      <FontAwesomeIcon icon="pen" />
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        dispatch(deleteCategory(category.id))
                                      }
                                    >
                                      <FontAwesomeIcon icon="trash-alt" />
                                    </button>
                                  </th>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Modal
        isOpen={modalAddNewCategoryState.isOpen}
        toggle={toggleModalAddNewCategory}
      >
        <ModalHeader
          toggle={toggleModalAddNewCategory}
          className="bg-dark text-white"
        >
          Add new category
        </ModalHeader>
        <ModalBody>
          {modalAddNewCategoryState.msg ? (
            <Alert
              color="danger"
              isOpen={modalAddNewCategoryState.alert}
              toggle={function noRefCheck() {
                setModalAddNewCategoryState({
                  ...modalAddNewCategoryState,
                  alert: false,
                });
                dispatch(clearErrors());
              }}
            >
              {modalAddNewCategoryState.msg}
            </Alert>
          ) : null}
          <div className="mb-2">
            <label htmlFor="categoryName" className="fw-bold">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              className="form-control"
              value={newCategoryState.category_name}
              onChange={(e) =>
                setNewCategoryState({
                  ...newCategoryState,
                  category_name: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-2">
            <label htmlFor="nameDisplayed" className="fw-bold">
              Name Displayed
            </label>
            <input
              type="text"
              id="nameDisplayed"
              name="nameDisplayed"
              className="form-control"
              value={newCategoryState.slug_name}
              onChange={(e) =>
                setNewCategoryState({
                  ...newCategoryState,
                  slug_name: e.target.value,
                })
              }
            />
          </div>
          {newCategoryState.icon === null ? null : (
            <div className="mb-2">
              <label className="d-block fw-bold mb-2">Selected Icon</label>
              <FontAwesomeIcon
                className="position-relative"
                icon={newCategoryState.icon}
                size="4x"
              />
              <FontAwesomeIcon
                className="position-absolute cursor-pointer ms-1 text-danger fs-4"
                icon="times"
                onClick={() =>
                  setNewCategoryState({ ...newCategoryState, icon: null })
                }
              />
            </div>
          )}
          <>
            <div className="mb-2">
              <label htmlFor="searchIcon" className="fw-bold">
                Icon
              </label>
              <input
                type="text"
                id="searchIcon"
                name="searchIcon"
                placeholder="Search an icon..."
                className="form-control"
                onChange={(e) =>
                  setModalAddNewCategoryState({
                    ...modalAddNewCategoryState,
                    searchTerm: [e.target.value],
                  })
                }
              />
            </div>
            <div className="scrolling-wrapper row flex-row flex-nowrap py-3">
              {iconList
                .filter((val) => {
                  if (modalAddNewCategoryState.searchTerm === "") {
                    return val;
                  } else if (
                    val.iconName.includes(modalAddNewCategoryState.searchTerm)
                  ) {
                    return val;
                  }
                })
                .map((item, index) => (
                  <div className="col-1" key={index}>
                    <FontAwesomeIcon
                      icon={["fas", item.iconName]}
                      className="cursor-pointer"
                      size="2x"
                      onClick={() => {
                        newCategoryState.icon === item.iconName
                          ? setNewCategoryState({
                              ...newCategoryState,
                              icon: null,
                            })
                          : setNewCategoryState({
                              ...newCategoryState,
                              icon: item.iconName,
                            });
                      }}
                      color={
                        newCategoryState.icon === item.iconName
                          ? "#198754"
                          : "black"
                      }
                    />
                  </div>
                ))}
            </div>
          </>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <button
            className="btn btn-dark"
            onClick={() => attendToAddNewCategory()}
          >
            <span className="fw-bold">Add category</span>
          </button>
        </ModalFooter>
      </Modal>

      {/* Modal edit category start */}
      <Modal isOpen={modalEditCategory.isOpen} toggle={toggleModalEditCategory}>
        <ModalHeader
          toggle={toggleModalEditCategory}
          className="bg-dark text-white"
        >
          Edit category
        </ModalHeader>
        <ModalBody>
          {modalEditCategory.msg ? (
            <Alert
              color="danger"
              isOpen={modalEditCategory.alert}
              toggle={function noRefCheck() {
                setModalEditCategory({
                  ...modalEditCategory,
                  alert: false,
                });
                dispatch(clearErrors());
              }}
            >
              {modalEditCategory.msg}
            </Alert>
          ) : null}
          <div className="mb-2">
            <label htmlFor="categoryName" className="fw-bold">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              className="form-control text-lowercase"
              value={updatedCategory.category_name}
              onChange={(e) =>
                setUpdatedCategory({
                  ...updatedCategory,
                  category_name: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-2">
            <label htmlFor="nameDisplayed" className="fw-bold">
              Name Displayed
            </label>
            <input
              type="text"
              id="nameDisplayed"
              name="nameDisplayed"
              className="form-control"
              value={updatedCategory.slug_name}
              onChange={(e) =>
                setUpdatedCategory({
                  ...updatedCategory,
                  slug_name: e.target.value,
                })
              }
            />
          </div>
          {updatedCategory.icon === null ? null : (
            <div className="mb-2">
              <label className="d-block fw-bold mb-2">Selected Icon</label>
              <FontAwesomeIcon
                className="position-relative"
                icon={updatedCategory.icon}
                size="4x"
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                className="position-absolute cursor-pointer ms-1 text-danger fs-4"
                icon="times"
                onClick={() =>
                  setUpdatedCategory({ ...updatedCategory, icon: null })
                }
              />
            </div>
          )}
          <>
            <div className="mb-2">
              <label htmlFor="searchIcon" className="fw-bold">
                Icon
              </label>
              <input
                type="text"
                id="searchIcon"
                name="searchIcon"
                placeholder="Search an icon..."
                className="form-control"
                onChange={(e) =>
                  setModalEditCategory({
                    ...modalEditCategory,
                    searchTerm: e.target.value,
                  })
                }
              />
            </div>
            <div className="scrolling-wrapper row flex-row flex-nowrap py-3">
              {iconList
                .filter((val) => {
                  if (modalEditCategory.searchTerm === "") {
                    return val;
                  } else if (
                    val.iconName.includes(modalEditCategory.searchTerm)
                  ) {
                    return val;
                  }
                })
                .map((item, index) => (
                  <div className="col-1" key={index}>
                    <FontAwesomeIcon
                      icon={["fas", item.iconName]}
                      className="cursor-pointer"
                      size="2x"
                      onClick={() => {
                        updatedCategory.icon === item.iconName
                          ? setUpdatedCategory({
                              ...updatedCategory,
                              icon: null,
                            })
                          : setUpdatedCategory({
                              ...updatedCategory,
                              icon: item.iconName,
                            });
                      }}
                      color={
                        updatedCategory.icon === item.iconName
                          ? "#198754"
                          : "black"
                      }
                    />
                  </div>
                ))}
            </div>
          </>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <button
            className="btn btn-dark"
            onClick={() => attendToEditCategory(updatedCategory.category_id)}
          >
            <span className="fw-bold">Edit category</span>
          </button>
        </ModalFooter>
      </Modal>
      {/* Modal edit category start end */}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    test: state.categories,
  };
};

export default connect(mapStateToProps)(Categories);
