const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const db = require("../../db/db");
const auth = require("../../middleware/auth");

// @route   GET /cart
// @desc    GET USER CART
// @access  Private
router.get("/", auth, (req, res) => {
  const id = req.user.id;

  db.query(
    `SELECT prod.id, prod.product_name, prod.product_image, prod.product_description, cart.product_quantity ,prod.product_price, prod.created_at, prod.updated_at FROM cart AS cart INNER JOIN products AS prod on prod.id = cart.product_id WHERE user_id = ${id} ORDER BY cart.id DESC`,
    (err, result) => {
      if (err) {
        if (err.code === "ER_NO_SUCH_TABLE") {
          db.query(
            "CREATE TABLE cart (id INT(11) auto_increment primary key NOT NULL, user_id INT(255), product_id INT(11), product_quantity INT(11), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP)",
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

// @route   POST /cart/
// @desc    POST PRODUCT TO CART
// @access  Private
router.post(
  "/add/:product_id/and/:user_id/and/:product_quantity",
  (req, res) => {
    db.query("INSERT INTO cart SET ?", req.params, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ result });
      }
    });
  }
);

// @route   UPDATE /cart/product/:id/quantity/:product_quantity
// @desc    DECREASE PRODUCT_QUANTITY FROM CART
// @access  private
router.put(
  "/decrease/quantity/:product_quantity/where/user_id/:user_id/and/product_id/:product_id",
  (req, res) => {
    const { product_id, product_quantity, user_id } = req.params;
    const newProductQuantity = Number(--req.params.product_quantity);

    db.query(
      `UPDATE cart SET product_quantity = ${newProductQuantity} WHERE user_id = ${user_id} AND product_id = ${product_id}`,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send({
            msg: `Quantity of product with id = ${product_id} was decreased to ${newProductQuantity}`,
          });
        }
      }
    );
  }
);

// @route   UPDATE /cart/product/:id
// @desc    INCREASE PRODUCT_QUANTITY FROM CART
// @access  private
router.put(
  "/increase/quantity/:product_quantity/where/user_id/:user_id/and/product_id/:product_id",
  (req, res) => {
    const { product_id, product_quantity, user_id } = req.params;
    const newProductQuantity = Number(++req.params.product_quantity);

    db.query(
      `UPDATE cart SET product_quantity = ${newProductQuantity} WHERE user_id = ${user_id} AND product_id = ${product_id}`,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send({
            msg: `Quantity of product with id = ${product_id} was increased to ${newProductQuantity}`,
          });
        }
      }
    );
  }
);

// @route  DELETE /cart/product/:id
// @desc   DECREASE PRODUCT_QUANTITY FROM CART
// @access Private

router.delete("/product/:id", auth, (req, res) => {
  const id = req.params.id;

  db.query(`DELETE FROM cart WHERE product_id = ${id}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ msg: `The item with id ${id} was deleted` });
    }
  });
});

module.exports = router;
