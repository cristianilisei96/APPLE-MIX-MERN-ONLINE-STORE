// almost done
const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const auth = require("../../middleware/auth");

// @route   GET /favorites/user/:id
// @desc    GET All favorites products of specific user
// @access  Private
router.get("/", auth, (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT product.id, product.product_name, product.product_image, product.product_description, product.product_quantity, product.product_price, product.created_at, product.updated_at from favorites AS favorit INNER JOIN products AS product on product.id = favorit.product_id WHERE user_id = ${user_id} ORDER BY favorit.id DESC`,
    (err, result) => {
      if (err) {
        if (err.code === "ER_NO_SUCH_TABLE") {
          db.query(
            "CREATE TABLE favorites (id INT(11) auto_increment primary key NOT NULL, user_id INT(11), product_id INT(11), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP)",
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
    }
  );
});

// de facut
// @route   POST /favorites/add/:product_id/and/:user_id
// @desc    POST PRODUCT TO FAVORITE
// @access  Public
router.post("/add/:product_id/and/:user_id", (req, res) => {
  db.query("INSERT INTO favorites SET ?", req.params, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ result });
    }
  });
});

// @route   DELETE /favorites/delete/:product_id
// @desc    DELETE SPECIFIC FAVORITE ITEM
// @access  Private
router.delete("/delete/product/:product_id", auth, (req, res) => {
  const product_id = req.params.product_id;

  db.query(`DELETE FROM favorites WHERE product_id = ${product_id}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send({
        msg: `Favorite product with id = ${product_id}, was deleted`,
      });
    }
  });
});

module.exports = router;
