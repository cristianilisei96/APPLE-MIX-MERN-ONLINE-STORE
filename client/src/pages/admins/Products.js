import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from "../../actions/errorActions";
import SimpleDateTime from "react-simple-timestamp-to-date";
import { getAllCategories } from "../../actions/categoryActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getProducts,
  addNewProduct,
  editProductFunction,
  deleteProduct,
} from "../../actions/productsActions";
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const Products = () => {
  const products = useSelector((state) => state.products.item);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const categories = useSelector((state) => state.categories.category);

  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.error);
  const msgFromCategoriesState = useSelector((state) => state.categories.msg);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterMethod, setFilterMethod] = useState({
    searchTerm: "",
  });

  const [modalAddProduct, setModalAddProduct] = useState({
    isOpen: false,
    alert: false,
    msg: "",
  });

  const toggleModalAddProduct = () => {
    setModalAddProduct({
      ...modalAddProduct,
      isOpen: !modalAddProduct.isOpen,
      alert: false,
      msg: "",
    });

    dispatch(clearErrors());
    setFile("");
    setUploadedFile("");
    setMessage("");
    setUploadPercentage(0);
  };

  const [newProduct, setNewProduct] = useState({
    product_image: "",
    product_name: "",
    category_id: "",
    product_description: "",
    product_quantity: "",
    product_price: "",
  });

  const [modalEditProduct, setModalEditProduct] = useState({
    isOpen: false,
    alert: false,
    msg: "",
  });

  const toggleModalEditProduct = (productId) => {
    setModalEditProduct({
      ...modalEditProduct,
      isOpen: !modalEditProduct.isOpen,
      alert: false,
      msg: "",
    });

    {
      typeof productId === "number"
        ? axios.get(`/products/${productId}`).then((res) =>
            setEditProduct({
              ...editProduct,
              product_id: productId,
              product_image: res.data[0].product_image,
              product_name: res.data[0].product_name,
              category_id: res.data[0].category_id,
              product_description: res.data[0].product_description,
              product_quantity: res.data[0].product_quantity,
              product_price: res.data[0].product_price,
            })
          )
        : setEditProduct({
            ...editProduct,
            product_id: "",
            product_image: "",
            product_name: "",
            category_id: "",
            product_description: "",
            product_quantity: "",
            product_price: "",
          });
    }

    dispatch(clearErrors());
    setFile("");
    setUploadedFile("");
    setMessage("");
    setUploadPercentage(0);
  };

  const [editProduct, setEditProduct] = useState({
    product_id: "",
    product_image: "",
    product_name: "",
    category_id: "",
    product_description: "",
    product_quantity: "",
    product_price: "",
  });

  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState("");
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChangeImage = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onUploadImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      });

      // Clear percentage
      // setTimeout(() => setUploadPercentage(0), 10000);

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage("Image uploaded");

      setNewProduct({
        ...newProduct,
        product_image: filePath,
      });
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0);
    }
  };

  const onSubmitNewProduct = () => {
    dispatch(addNewProduct(newProduct));

    if (
      newProduct.product_image !== "" ||
      newProduct.product_name.length <= 0 ||
      newProduct.category_id.length <= 0 ||
      newProduct.product_description.length <= 0 ||
      newProduct.product_quantity.length <= 0 ||
      newProduct.product_price.length <= 0
    ) {
    } else {
      dispatch(getProducts());
      toggleModalAddProduct();
    }
  };

  const changeEditCategoryFromProduct = (e) => {
    setEditProduct({
      ...editProduct,
      category_id: e.target.value,
    });
  };

  const onSubmitEditProduct = (e) => {
    e.preventDefault();

    dispatch(editProductFunction(editProduct));
  };

  const tokenFromLocalStorage = localStorage.getItem("token");

  useEffect(() => {
    if (!tokenFromLocalStorage) {
      navigate("/login");
    } else {
      if (user && user.role_id !== 1) {
        console.log("nu e admin");
        navigate("/login");
      } else {
        dispatch(getAllCategories());
        dispatch(getProducts());
      }
    }

    if (error.id === "ADMIN_ADD_PRODUCT_FAIl") {
      setModalAddProduct({
        ...modalAddProduct,
        alert: true,
        msg: error.msg.msg,
      });
    } else if (error.id === "ADMIN_EDIT_PRODUCT_FAIL") {
      setModalEditProduct({
        ...modalEditProduct,
        alert: true,
        msg: error.msg.msg,
      });
    }
  }, [
    tokenFromLocalStorage,
    isAuthenticated,
    user,
    dispatch,
    navigate,
    error,
    msgFromCategoriesState,
    editProduct,
  ]);

  return (
    <>
      <Navbar />
      <div id="productsDashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="card border-dark">
                <div className="card-header bg-dark text-white">
                  <span className="fw-bold fs-4">
                    {products.length === 1 ? "Product" : "Products"} :{" "}
                    <span className="text-success">{products.length}</span>
                  </span>
                  <div className="float-end">
                    <button
                      className="btn btn-success"
                      onClick={() => toggleModalAddProduct()}
                    >
                      <FontAwesomeIcon icon="plus" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {products.length === 0 ? (
                    <p className="m-0">There are currently no categories</p>
                  ) : (
                    <>
                      <h5 className="text-black">
                        Search for a product by product name, cateogry name,
                        description or price number.
                      </h5>
                      <div className="filter position-relative">
                        <FontAwesomeIcon
                          icon="search"
                          className="icon text-success"
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Search a product.."
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
                          id="tableProductsDashboard"
                          className="table table-hover mb-0"
                        >
                          <thead>
                            <tr>
                              <th scope="col" style={{ minWidth: "80px" }}>
                                <FontAwesomeIcon icon="hashtag" /> ID
                              </th>
                              <th scope="col">
                                <FontAwesomeIcon icon="camera" /> Image
                              </th>
                              <th scope="col">
                                <FontAwesomeIcon icon="fingerprint" /> Name
                              </th>
                              <th scope="col" style={{ minWidth: "110px" }}>
                                <FontAwesomeIcon icon="tag" /> Category
                              </th>
                              <th scope="col" style={{ minWidth: "130px" }}>
                                <FontAwesomeIcon icon="keyboard" /> Description
                              </th>
                              <th scope="col" style={{ minWidth: "100px" }}>
                                <FontAwesomeIcon icon="calculator" /> Stock
                              </th>
                              <th scope="col" style={{ minWidth: "100px" }}>
                                <FontAwesomeIcon icon="money-bill" /> Price
                              </th>
                              <th scope="col" style={{ minWidth: "130px" }}>
                                <FontAwesomeIcon icon="calendar-alt" /> Created
                              </th>
                              <th scope="col" style={{ minWidth: "130px" }}>
                                <FontAwesomeIcon icon="pen" /> Updated at
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
                            {products
                              .filter((val) => {
                                if (filterMethod.searchTerm === "") {
                                  return val;
                                } else if (
                                  val.product_name
                                    .toLowerCase()
                                    .includes(filterMethod.searchTerm)
                                ) {
                                  return val;
                                } else if (
                                  val.category_name !== null &&
                                  val.category_name.includes(
                                    filterMethod.searchTerm
                                  )
                                ) {
                                  return val;
                                } else if (
                                  val.product_description !== null &&
                                  val.product_description.includes(
                                    filterMethod.searchTerm
                                  )
                                ) {
                                  return val;
                                } else if (
                                  Number(filterMethod.searchTerm) ===
                                  val.product_price
                                ) {
                                  return val;
                                }
                              })
                              .map((product) => (
                                <tr key={product.id} className="align-middle">
                                  <th scope="row">#{product.id}</th>
                                  <th>
                                    <img
                                      src={product.product_image}
                                      alt={product.product_name}
                                      width="100"
                                    />
                                  </th>
                                  <th>{product.product_name}</th>
                                  <th>{product.category_name}</th>
                                  <th>{product.product_description}</th>
                                  <th>{product.product_quantity}</th>
                                  <th className="text-success">
                                    ${product.product_price}
                                  </th>
                                  <th>
                                    <SimpleDateTime
                                      timeSeparator=":"
                                      timeFormat="HMS"
                                      showTime="1"
                                      showDate="0"
                                      meridians="1"
                                    >
                                      {product.created_at}
                                    </SimpleDateTime>
                                    {" - "}
                                    <SimpleDateTime
                                      dateSeparator="."
                                      showTime="0"
                                      dateFormat="DMY"
                                    >
                                      {product.created_at}
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
                                      {product.updated_at}
                                    </SimpleDateTime>
                                    {" - "}
                                    <SimpleDateTime
                                      dateSeparator="."
                                      showTime="0"
                                      dateFormat="DMY"
                                    >
                                      {product.updated_at}
                                    </SimpleDateTime>
                                  </th>
                                  <th>
                                    <button
                                      className="btn btn-warning"
                                      onClick={() =>
                                        toggleModalEditProduct(product.id)
                                      }
                                    >
                                      <FontAwesomeIcon icon="pen" />
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        dispatch(deleteProduct(product.id))
                                      }
                                    >
                                      <FontAwesomeIcon icon="trash" />
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
      <Modal isOpen={modalAddProduct.isOpen} toggle={toggleModalAddProduct}>
        <ModalHeader
          toggle={toggleModalAddProduct}
          className="bg-dark text-white"
        >
          Add Product
        </ModalHeader>
        <ModalBody>
          {modalAddProduct.msg ? (
            <>
              <div className="col-md-12">
                <Alert color="danger" isOpen={modalAddProduct.alert}>
                  {modalAddProduct.msg}
                </Alert>
              </div>
            </>
          ) : null}
          <div className="mb-2">
            <label htmlFor="fileInput" className="fw-bold mb-2">
              Image product
            </label>

            {uploadedFile === "" ? (
              <>
                <input
                  type="file"
                  className="form-control mb-2"
                  id="fileInput"
                  onChange={onChangeImage}
                />

                {file ? (
                  <input
                    type="submit"
                    value="Upload"
                    className="btn btn-dark btn-block text-white fw-bold mb-2"
                    onClick={onUploadImage}
                  />
                ) : null}
              </>
            ) : (
              <div className="row">
                <div className="col-md-6 mx-auto">
                  <img
                    className="img-fluid"
                    src={uploadedFile.filePath}
                    alt=""
                  />
                </div>
                <div
                  className="alert alert-success alert-dismissible fade show mt-2 mb-0"
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </div>

          <div className="mb-2">
            <label htmlFor="productNameInput" className="fw-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="productNameInput"
              className="form-control"
              value={newProduct.product_name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  product_name: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-2">
            <label htmlFor="" className="fw-bold">
              Category
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              defaultValue={"DEFAULT"}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  category_id: e.target.value,
                })
              }
            >
              <option value="DEFAULT" disabled>
                Choose a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="productDescriptionInput" className="fw-bold mb-2">
              Description
            </label>
            <input
              type="text"
              id="productDescriptionInput"
              className="form-control"
              value={newProduct.product_description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  product_description: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-2">
            <label htmlFor="productQuantityInput" className="fw-bold mb-2">
              Quantity
            </label>
            <input
              type="text"
              id="productQuantityInput"
              className="form-control"
              value={newProduct.product_quantity}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  product_quantity: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-2">
            <label htmlFor="productPriceInput" className="fw-bold mb-2">
              Price in $(just number)
            </label>
            <input
              type="text"
              id="productPriceInput"
              className="form-control"
              value={newProduct.product_price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  product_price: e.target.value,
                })
              }
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-dark fw-bold" onClick={onSubmitNewProduct}>
            Add
          </button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalEditProduct.isOpen} toggle={toggleModalEditProduct}>
        <ModalHeader
          toggle={toggleModalEditProduct}
          className="bg-dark text-white"
        >
          Edit Product #{editProduct.product_id}
        </ModalHeader>
        <ModalBody>
          {modalEditProduct.msg ? (
            <>
              <div className="col-md-12">
                <Alert color="danger" isOpen={modalEditProduct.alert}>
                  {modalEditProduct.msg}
                </Alert>
              </div>
            </>
          ) : null}
          <div className="mb-2">
            <label className="fw-bold mb-2">Image product</label>
            <div className="row">
              <div className="col-md-7 mx-auto">
                <img
                  src={editProduct.product_image}
                  className="img-fluid"
                  alt={editProduct.product_name}
                />
              </div>
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="fileInput" className="fw-bold mb-2">
              Upload new image for product
            </label>

            {uploadedFile === "" ? (
              <>
                <input
                  type="file"
                  className="form-control mb-2"
                  id="fileInput"
                  onChange={onChangeImage}
                />

                {file ? (
                  <input
                    type="submit"
                    value="Upload"
                    className="btn btn-dark btn-block text-white fw-bold mb-2"
                    onClick={onUploadImage}
                  />
                ) : null}
              </>
            ) : (
              <div className="row">
                <div className="col-md-6 mx-auto">
                  <img
                    className="img-fluid"
                    src={uploadedFile.filePath}
                    alt=""
                  />
                </div>
                <div
                  className="alert alert-success alert-dismissible fade show mt-2 mb-0"
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </div>

          <div className="mb-2">
            <label htmlFor="productNameInput" className="fw-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="productNameInput"
              className="form-control"
              value={editProduct.product_name}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  product_name: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-2">
            <label htmlFor="" className="fw-bold">
              Category
            </label>
            <select
              className="form-select"
              value={editProduct.category_id}
              onChange={(e) => changeEditCategoryFromProduct(e)}
            >
              {categories.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="productDescriptionInput" className="fw-bold mb-2">
              Description
            </label>
            <input
              type="text"
              id="productDescriptionInput"
              className="form-control"
              value={editProduct.product_description}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  product_description: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-2">
            <label htmlFor="productQuantityInput" className="fw-bold mb-2">
              Quantity
            </label>
            <input
              type="text"
              id="productQuantityInput"
              className="form-control"
              value={editProduct.product_quantity}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  product_quantity: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-2">
            <label htmlFor="productPriceInput" className="fw-bold mb-2">
              Price in $(just number)
            </label>
            <input
              type="text"
              id="productPriceInput"
              className="form-control"
              value={editProduct.product_price}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  product_price: e.target.value,
                })
              }
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-dark fw-bold"
            onClick={() => onSubmitEditProduct()}
          >
            Edit
          </button>
        </ModalFooter>
      </Modal>
      <Footer />
    </>
  );
};

export default Products;
