const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const auth = require("../../middleware/auth");

// @route   GET /products
// @desc    GET All products
// @access  Public
router.get("/", (req, res) => {
  db.query(
    "SELECT product.id, product.category_id, category.category_name, product.product_name, product.product_image, product.product_description, product.product_quantity, product.product_price, product.created_at, product.updated_at FROM products as product INNER JOIN categories as category ON category.id = product.category_id ORDER BY product.id DESC",
    (err, result) => {
      if (err) {
        if (err.code === "ER_NO_SUCH_TABLE") {
          db.query(
            "CREATE TABLE products (id INT(11) auto_increment primary key NOT NULL, category_id INT(11) NOT NULL, product_name VARCHAR(255) NOT NULL, product_image VARCHAR(255) NOT NULL, product_description VARCHAR(255) NOT NULL, product_price INT(11) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL)",
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        } else {
          console.log(err);
        }
      } else {
        res.send(result);
      }
    }
  );
});

// @route   POST /products/addnewproduct
// @desc    POST new product
// @access  Private
router.post("/addnewproduct", auth, (req, res) => {
  const {
    product_image,
    product_name,
    category_id,
    product_description,
    product_quantity,
    product_price,
  } = req.body;

  // Simple validation
  if (!product_image) {
    return res.status(400).json({ msg: "Please upload a image of product" });
  } else if (!product_name) {
    return res.status(400).json({ msg: "Please fill in the Name field" });
  } else if (!category_id) {
    return res.status(400).json({ msg: "Please choose a Category" });
  } else if (!product_description) {
    return res
      .status(400)
      .json({ msg: "Please fill in the Description field" });
  } else if (!product_quantity) {
    return res.status(400).json({ msg: "Please fill in the Quantity field" });
  } else if (!product_price) {
    return res.status(400).json({ msg: "Please fill in the Price field" });
  } else {
    db.query("INSERT INTO products SET ?", req.body, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    });
  }
});

// done
// @route GET /products/:id
// @desc  GET Specific product
// @access Public
router.get("/:product_id/get-product-details", (req, res) => {
  const product_id = req.params.product_id;

  db.query("SELECT * FROM products WHERE id = ?", product_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// @route   PUT /produts/update
// @desc    PUT update product
// @access  Private
router.put("/updateproduct", auth, (req, res) => {
  const {
    product_id,
    product_image,
    product_name,
    category_id,
    product_description,
    product_quantity,
    product_price,
  } = req.body;

  // Simple validation
  if (!product_name) {
    return res.status(400).json({ msg: "Please fill in the Name field" });
  } else if (!category_id) {
    return res.status(400).json({ msg: "An unexpected error occurred" });
  } else if (!product_description) {
    return res
      .status(400)
      .json({ msg: "Please fill in the Description field" });
  } else if (!product_quantity) {
    return res.status(400).json({ msg: "Please fill in the Quantity field" });
  } else if (product_quantity < 0) {
    return res.status(400).json({ msg: "Quantity cannot be less than 0" });
  } else if (!product_price) {
    return res.status(400).json({ msg: "Please fill in the Price field" });
  } else {
    db.query(
      `UPDATE products SET product_name = '${product_name}', category_id = '${category_id}', product_description = '${product_description}', product_quantity = '${product_quantity}', product_price = '${product_price}' WHERE id = '${product_id}'`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ result });
        }
      }
    );
  }
});

// @route   GET /products/getproductbysearchword/:name
// @desc    GET products by search word
// @access  Public
router.get("/getproductbysearchword/:name", (req, res) => {
  const name = req.params.name;

  db.query(
    `SELECT product.id, product.category_id, category.category_name, product.product_name, product.product_image, product.product_description, product.product_quantity, product.product_price, product.created_at, product.updated_at FROM products AS product INNER JOIN categories AS category ON product.category_id = category.id WHERE product_name REGEXP '[[:<:]]${name}[[:>:]]' OR category_name REGEXP '[[:<:]]${name}[[:>:]]'`,
    name,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// @route   GET /products/category/:category_name
// @desc    GET products from category filter
// @access  Public
router.get("/category/:category_name", (req, res) => {
  const category_name = req.params.category_name;

  db.query(
    `SELECT product.id, product.category_id, category.category_name ,product.product_name, product.product_image, product.product_description, product.product_quantity, product.product_price, product.created_at, product.updated_at from products AS product INNER JOIN categories AS category on category.id = product.category_id WHERE category.category_name = '${category_name}'`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// @route   DELETE /products/:product_id
// @desc    DELETE a product with his reviews
// @access  Private
router.delete("/:product_id", auth, (req, res) => {
  const product_id = req.params.product_id;

  db.query(`DELETE FROM products WHERE id = ${product_id}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      db.query(
        `DELETE FROM reviews WHERE product_id = ${product_id}`,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      res.json({
        msg: `The product with id ${product_id} and his reviews was deleted !`,
      });
    }
  });
});

module.exports = router;
