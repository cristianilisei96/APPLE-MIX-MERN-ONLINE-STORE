const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const auth = require("../../middleware/auth");

// done
// @route   GET /cartegories/get-all-categories
// @desc    GET All categories
// @access  Public
router.get("/get-all-categories", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY id DESC", (err, result) => {
    if (err) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        db.query(
          "CREATE TABLE categories (id INT(11) auto_increment primary key NOT NULL, category_name VARCHAR(255), slug_name VARCHAR(255), icon VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP)",
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    } else {
      res.send(result);
    }
  });
});

// de facut ?
// @route   GET /cartegories/category/:id
// @desc    GET a specific category
// @access  Public
router.get("/category/:id", auth, (req, res) => {
  const id = req.params.id;

  db.query(`SELECT * FROM categories WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// @route   Put /categories/category/:id
// @desc    Update a category
// @access  Private
router.put("/category/update", (req, res) => {
  const { category_id, category_name, slug_name, icon } =
    req.body.updatedCategory;

  // Simple validation
  if (!category_name) {
    return res
      .status(400)
      .json({ msg: "Please fill in the Category Name field" });
  }
  if (!slug_name) {
    return res
      .status(400)
      .json({ msg: "Please fill in the Name Displayed field" });
  }
  if (!icon) {
    return res.status(400).json({ msg: "Please select an Icon" });
  }

  db.query(
    `UPDATE categories SET category_name = '${category_name}', slug_name = '${slug_name}', icon = '${icon}' WHERE id = '${category_id}'`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send({
          id: category_id,
          category_name,
          slug_name,
          icon,
        });
      }
    }
  );
});

// @route   POST /categories/addnewcategory
// @desc    Register new category
// @access  Private
router.post("/addnewcategory", (req, res) => {
  const { category_name, slug_name, icon } = req.body;

  // Simple validation
  if (!category_name) {
    return res
      .status(400)
      .json({ msg: "Please fill in the Category Name field" });
  }
  if (!slug_name) {
    return res
      .status(400)
      .json({ msg: "Please fill in the Name Displayed field" });
  }
  if (!icon) {
    return res.status(400).json({ msg: "Please select an Icon" });
  }

  db.query(
    "INSERT INTO categories SET ?",
    [{ category_name, slug_name, icon }],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        const currentDate = new Date();
        res.json({
          category: {
            id: results.insertId,
            slug_name,
            category_name,
            icon,
            created_at: currentDate,
            updated_at: currentDate,
          },
        });
      }
    }
  );
});

// @route   DELETE /categories/category/:id
// @desc    DELETE a category with all her products and reviews
// @access  Private
router.delete("/category/:id", auth, (req, res) => {
  const id = req.params.id;

  db.query(`DELETE FROM categories WHERE id = ${id}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      db.query(`DELETE FROM products WHERE category_id = ${id}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
      db.query(`DELETE FROM reviews WHERE category_id = ${id}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.json({
        msg: `The category with id ${id} and all products with that category_id was deleted !`,
      });
    }
  });
});

module.exports = router;
