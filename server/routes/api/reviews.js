const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const auth = require("../../middleware/auth");

// @route   GET /reviews
// @desc    GET all reviews
// @access  Public
router.get("/", (req, res) => {
  db.query(
    "SELECT review.id, product.product_image, product.product_name, review.product_id, user.first_name, user.last_name, review.user_id, review.rating, review.rating_text, review.message, review.status, review.created_at, review.updated_at FROM reviews AS review INNER JOIN products as product ON product.id = review.product_id INNER JOIN users as user ON user.id = review.user_id ORDER BY review.id DESC",
    (err, result) => {
      if (err) {
        if (err.code === "ER_NO_SUCH_TABLE") {
          db.query(
            "CREATE TABLE reviews (id INT(11) auto_increment primary key NOT NULL, product_id INT(11), user_id INT(11), rating INT(11), rating_text VARCHAR(255), message VARCHAR(255), status VARCHAR(255) DEFAULT pending, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP)",
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

// done
// @route   GET /reviews/product/:product_id
// @desc    GET product reviews
// @access  Public
router.get("/product/:product_id/get-product-reviews", (req, res) => {
  const product_id = req.params.product_id;

  db.query(
    `SELECT review.id, review.product_id, user.first_name, user.last_name, user.avatar, review.rating, review.rating_text, review.message, review.status, review.created_at, review.updated_at FROM reviews as review INNER JOIN users AS user ON user.id = review.user_id WHERE product_id = ${product_id} ORDER BY review.id DESC`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// @route   GET /reviews/get-user-reviews
// @desc    GET all reviews of specific user
// @access  Private
router.get("/get-user-reviews", auth, (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT rew.id, prod.product_image, prod.product_name, rew.product_id, rew.user_id, rew.rating, rew.rating_text, rew.message, rew.status, rew.created_at FROM reviews AS rew INNER JOIN products AS prod ON prod.id = rew.product_id WHERE user_id = ${user_id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

// @route   POST /reviews/product/
// @desc    POST new product review
// @access  Private
// de facut !!!
router.post("/post-review", auth, (req, res) => {
  const {
    product_id,
    user_id,
    first_name,
    last_name,
    rating,
    rating_text,
    message,
  } = req.body;

  if (!rating) {
    return res.status(400).json({ msg: "Please rate the product !" });
  }
  if (!message) {
    return res.status(400).json({ msg: "The review field can't be empty !" });
  }

  db.query(
    "INSERT INTO reviews SET ?",
    [{ product_id, user_id, rating, rating_text, message }],
    (err, insert) => {
      if (err) {
        console.log(err);
      } else {
        const newReview = {
          id: insert.insertId,
          product_id,
          first_name,
          last_name,
          rating,
          rating_text,
          message,
        };

        res.send(newReview);
      }
    }
  );
});

// @route   UPDATE /reviews/product/:id
// @desc    UPDATE status of specifig review to 'active'
// @access  Private
// de facut !!!
router.put("/moderated/product/:id", (req, res) => {
  const reviewId = req.params.id;

  db.query(
    `UPDATE reviews SET status = 'active' WHERE id = ${reviewId}`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        db.query(
          `SELECT review.id, review.status, review.updated_at FROM reviews AS review WHERE review.id = ${reviewId}`,
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send({
                id: result[0].id,
                status: result[0].status,
                updated_at: result[0].updated_at,
              });
            }
          }
        );
      }
    }
  );
});

// @route   UPDATE /reviews/product/:id
// @desc    UPDATE STATUS REVIEW TO UNMODERATE
// @access  Public
// de facut !!!
router.put("/unmoderated/product/:id", (req, res) => {
  const reviewId = req.params.id;

  db.query(
    `UPDATE reviews SET status = 'pending' WHERE id = ${reviewId}`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        db.query(
          `SELECT review.id, review.status, review.updated_at FROM reviews AS review WHERE review.id = ${reviewId}`,
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send({
                id: result[0].id,
                status: result[0].status,
                updated_at: result[0].updated_at,
              });
            }
          }
        );
      }
    }
  );
});

// @route   DELETE /reviews/delete/:id
// @desc    DELETE a specific review
// @access  Private
router.delete("/delete/:id", auth, (req, res) => {
  const reviewId = req.params.id;

  db.query(`DELETE FROM reviews WHERE id = ${reviewId}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ msg: `The review with the id ${reviewId} was deleted !` });
    }
  });
});

// @route   DELETE /reviews/deleteallreviews
// @desc    DELETE ALL REVIEWS
// @access  private
router.delete("/deleteallreviews", auth, (req, res) => {
  db.query("DROP TABLE reviews", (err) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ msg: `The reviews table was deleted !` });
    }
  });
});

module.exports = router;
