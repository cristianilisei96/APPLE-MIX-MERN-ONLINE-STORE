const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const tokenForRecover = require("../../middleware/password");

// @route   POST /passwords/forgotyourpassword
// @desc    POST send reset password link
// @access  Public
router.post("/forgotyourpassword", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Please fill in the email field" });
  } else {
    db.query(
      `SELECT id, role_id, alias, avatar, first_name, last_name, email, phone FROM users WHERE email = '${email}'`,
      (err, result) => {
        // User exist and create One time link valid for 15'
        if (result.length > 0) {
          const JWT_SECRET = "some super secret...";

          const payload = {
            email: result[0].email,
            id: result[0].id,
          };

          jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" }, (err, token) => {
            if (err) throw err;
            res.json({
              msg: "Password reset link has been sent to your email..",
              tokenForRecover: token,
            });

            const link = `http://localhost:3000/reset-password/user_id/${result[0].id}/token/${token}`;

            var transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              auth: {
                user: "cristianilisei96@gmail.com",
                pass: "ttqqkmerjkwjpzfk",
              },
            });

            let mailOptions = {
              from: '"Apple Mix Contact" <foo@blurdybloop.com',
              to: `${email}`,
              subject: "Reset password Apple Mix",
              html: `
              <p><b>Hello,</b></p>
              <b>Follow the link below to reset your password. The link is valid for 15 minutes</b>
              <h4>${link}</h4>`,
            };

            transporter.sendMail(mailOptions, function (err, success) {
              if (err) {
                console.log(err);
              } else {
                console.log("Email sent successfully!");
              }
            });
          });
        } else {
          // Check if user exist in database
          res.status(400).json({ msg: "This email is not registered" });
        }
      }
    );
  }
});

// @route   POST /passwords/check-if-tokenis-valid
// @desc    POST check if token to reset is valid (<15')
// @access  Public
router.post("/check-if-token-is-valid", tokenForRecover, (req, res) => {
  const token = req.body.token;

  try {
    jwt.verify(token, "some super secret...", (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        return res.json({
          msg: "token is valid",
          tokenForRecover: token,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// @route   POST /passwords/reset-password/user/:id/token/:token
// @desc    reset password to specific user
// @access  Public
router.post("/reset-password/user_id/:user_id/token/:token", (req, res) => {
  const { user_id } = req.body;
  const { new_password } = req.body;

  // Simple validation
  if (!new_password) {
    return res.status(400).json({ msg: "The password can't be empty!" });
  } else if (new_password.length <= 8) {
    return res.status(400).json({
      msg: "The password must contain at least 8 letters, a number and a symbol!",
    });
  } else if (new_password.search(/[a-zA-Z]/) == -1) {
    return res.status(400).json({
      msg: "The password must contain letters!",
    });
  } else if (new_password.search(/\d/) == -1) {
    return res.status(400).json({
      msg: "The password must contain a number!",
    });
  } else if (
    new_password.search(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) === -1
  ) {
    return res.status(400).json({ msg: "The password must contain a symbol!" });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(new_password, salt, (err, hash) => {
        const passwordEncripted = hash;
        db.query(
          `UPDATE users SET password = '${passwordEncripted}' WHERE id = ${user_id}`,
          (err) => {
            if (err) {
              console.log(err);
            } else {
              res.send({
                msg: `The password was successfully updated`,
              }),
                console.log("The password was successfully uodated");
            }
          }
        );
      });
    });
  }
});

module.exports = router;
