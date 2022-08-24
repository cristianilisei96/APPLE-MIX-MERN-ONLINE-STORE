import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllCategories } from "../actions/categoryActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FontAwesomeIcons";

const CategorySidebarComponent = () => {
  const pathName = window.location.pathname;

  const categories = useSelector((state) => state.categories.category);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <>
      <div className="col-md-3 mb-4">
        <div id="titleCategorySidebar" className="card bg-dark text-white mb-4">
          <div className="card-body">
            <h5 className="m-0 fw-bold">Categories</h5>
          </div>
        </div>
        <div id="categorySidebar" className="card bg-dark">
          {categories
            .sort((a, b) => a.id - b.id)
            .map((category) => (
              <Link
                key={category.id}
                id={`${category.category_name}CategoryLink`}
                to={`/products/category=${category.category_name}`}
                className={
                  pathName === `/products/category=${category.category_name}`
                    ? "list-group-item bg-success text-black"
                    : "list-group-item bg-dark text-white"
                }
              >
                <h5 className="m-0">
                  <FontAwesomeIcon icon={category.icon} />
                  {category.slug_name}
                </h5>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default CategorySidebarComponent;
