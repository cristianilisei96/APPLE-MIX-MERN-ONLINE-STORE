const express = require("express");
const router = express.Router();
const db = require("../../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const path = require("path");
var fs = require("fs");

// done
// @route   POST /users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const {
    role_id,
    alias,
    avatar,
    first_name,
    last_name,
    email,
    phone,
    password,
  } = req.body;

  var constructDateOfRegistration = new Date(),
    month = "" + (constructDateOfRegistration.getMonth() + 1),
    day = "" + constructDateOfRegistration.getDate(),
    year = constructDateOfRegistration.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  const dateOfRegistration = [year, month, day].join("-");

  // Simple validation
  if (!first_name) {
    return res.status(400).json({ msg: "Please fill in the First Name field" });
  } else if (!last_name) {
    return res.status(400).json({ msg: "Please fill in the Last Name field" });
  } else if (!email) {
    return res.status(400).json({ msg: "Please fill in the email field" });
  } else if (!password) {
    return res.status(400).json({ msg: "Please fill in the password field" });
  } else {
    db.query("SELECT * FROM users", (err, result) => {
      if (err) {
        if (err.code === "ER_NO_SUCH_TABLE") {
          db.query(
            "CREATE TABLE users (id INT(11) auto_increment primary key NOT NULL, role_id INT(11) DEFAULT 2 NOT NULL, alias varchar(255) DEFAULT 'Needs revision' NOT NULL, avatar LONGTEXT DEFAULT 'Needs revision' NOT NULL, first_name varchar(255) NOT NULL, last_name varchar(255) NOT NULL, email varchar(255) NOT NULL, phone varchar(255) DEFAULT 'Needs revision' NOT NULL, password varchar(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL)",
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                db.query("SELECT * FROM roles", (err, result) => {
                  if (err) {
                    if (err.code === "ER_NO_SUCH_TABLE") {
                      db.query(
                        "CREATE TABLE roles (id INT(11) auto_increment primary key NOT NULL, role_name varchar(255) NOT NULL",
                        (err, result) => {
                          if (err) {
                            console.log(err);
                          } else {
                            db.query(
                              "INSERT INTO roles (id, role_name) VALUES ('1', 'admin'), ('2', 'user')",
                              (err, result) => {
                                if (err) {
                                  console.log(err);
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                });
              }
            }
          );
        }
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            console.log(err);
          }
          req.body.password = hash;
          db.query(
            "SELECT * FROM users WHERE email = ?",
            email,
            (err, results) => {
              if (results.length > 0) {
                res.status(400).json({ msg: "Email already used" });
              } else {
                db.query(
                  "INSERT INTO users SET ? ",
                  req.body,
                  (error, results) => {
                    if (error) {
                      console.log(error);
                    } else {
                      jwt.sign(
                        { id: results.insertId },
                        config.get("jwtSecret"),
                        {
                          expiresIn: "9h",
                        },
                        (err, token) => {
                          if (err) {
                            console.log(err);
                          } else {
                            res.json({
                              token,
                              user: {
                                id: results.insertId,
                                role_id,
                                alias,
                                avatar,
                                first_name,
                                last_name,
                                email,
                                phone,
                                created_at: dateOfRegistration,
                              },
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        });
      });
    });
  }
});

// done
// @route   POST /users/login
// @desc    Auth user
// @access  Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email) {
    return res.status(400).json({ msg: "Please fill in the Email field" });
  } else if (!password) {
    return res.status(400).json({ msg: "Please fill in the Password field" });
  } else {
    db.query(
      `SELECT users.id, users.role_id, roles.role_name, users.alias, users.avatar, users.first_name, users.last_name, users.email, users.phone, users.password, users.created_at, users.updated_at FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.email = '${email}'`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else if (result.length < 1) {
          res.status(400).json({ msg: "Email invalid!" });
        } else {
          const {
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
          } = result[0];

          bcrypt.compare(password, result[0].password).then((isMatch) => {
            if (!isMatch)
              return res.status(400).json({ msg: "Invalid credentials" });

            jwt.sign(
              { id },
              config.get("jwtSecret"),
              { expiresIn: "9h" },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
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
                  },
                });
              }
            );
          });
        }
      }
    );
  }
});

// done
// @route   GET /users/get-user-personal-data
// @desc    GET data of current user logged
// @access  Private
router.get("/get-user-personal-data", auth, (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT user.id, user.role_id, role.role_name, user.alias, user.first_name, user.last_name, user.email, user.phone, user.created_at, user.updated_at FROM users AS user INNER JOIN roles AS role ON user.role_id = role.id WHERE user.id = ${user_id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

// almost done
// @router  POST /users/edit-avatar
// @desc    POST new avatar to specific user
// @access  Private de facut
router.post("/edit-avatar", (req, res) => {
  const user_id = req.body.user_id;
  const avatar = req.body.avatar;

  if (avatar === null) {
    return res.status(400).json({ msg: "Select another picture to change!" });
  } else {
    db.query(
      `UPDATE users SET avatar = '${avatar}' WHERE id = ${user_id}`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json(user_id);
        }
      }
    );
  }
});

// de facut validare
// @router  UPDATE /users/user/:id
// @desc    UPDATE new value of user
// @access  Private
router.put("/update-user-personal-data", auth, (req, res) => {
  const { id, alias, first_name, last_name, email, phone } = req.body;

  // de facut validarea calumea
  // min and max 13 caract numar
  // alias ul min 3 caract

  if (!alias) {
    return res.status(400).json({ msg: "The Alias field cannot be empty" });
  } else if (!first_name) {
    return res
      .status(400)
      .json({ msg: "The First Name field cannot be empty" });
  } else if (!last_name) {
    return res.status(400).json({ msg: "The Last Name field cannot be empty" });
  } else if (!email) {
    return res.status(400).json({ msg: "The Email field cannot be empty" });
  } else if (!phone) {
    return res.status(400).json({ msg: "The Phone field cannot be empty" });
  } else {
    db.query(
      `UPDATE users SET alias = '${alias}', first_name = '${first_name}', last_name = '${last_name}', email = '${email}', phone = '${phone}' WHERE id = ${id}`,
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              msg: "Email is already assigned to a user",
            });
          } else {
            console.log(err);
          }
        } else {
          db.query(
            `SELECT id, role_id, alias, avatar, first_name, last_name, email, phone, created_at FROM users WHERE id = ${id}`,
            (err, user) => {
              if (err) {
                console.log(err);
              } else {
                res.json({
                  id: user[0].id,
                  alias: user[0].alias,
                  avatar: user[0].avatar,
                  first_name: user[0].first_name,
                  last_name: user[0].last_name,
                  email: user[0].email,
                  phone: user[0].phone,
                  role_id: user[0].role_id,
                  created_at: user[0].created_at,
                });
              }
            }
          );
        }
      }
    );
  }
});

// almost done
// @route   GET /users/getallusers
// @desc    GET All users
// @access  Private
router.get("/getallusers", auth, (req, res) => {
  db.query(
    "SELECT user.id, user.role_id, role.role_name, user.alias, user.avatar, user.first_name, user.last_name, user.email, user.phone, user.created_at, user.updated_at FROM users AS user INNER JOIN roles AS role ON role.id = user.role_id ORDER BY user.id DESC",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// almost done - de facut
// @route   GET /users/admins
// @desc    GET All admins
// @access  Public
router.get("/admins", (req, res) => {
  db.query("SELECT * FROM users WHERE role_id = '1' ", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result.filter((user) => user.role_id === 1));
      res.send(result.filter((user) => user.role_id === 1));
    }
  });
});

// de facut auth
// @route   UPDATE /users/usertoadmin/:id
// @desc    UPDATE USER TO
// @access  Private to make
router.put("/usertoadmin/:id", (req, res) => {
  const user_id = req.params.id;

  db.query(
    `UPDATE users SET role_id = 1 WHERE id = ${user_id}`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        db.query(`SELECT * FROM users WHERE id = ${user_id}`, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ id: result[0].id, role_id: result[0].role_id });
          }
        });
        // res.send({ id: userId });
      }
    }
  );
});

// de facut auth
// @route   UPDATE /users/usertouser/:id
// @desc    UPDATE USER TO
// @access  Private
router.put("/usertouser/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    `UPDATE users SET role_id = 2 WHERE id = ${userId}`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        db.query(`SELECT * FROM users WHERE id = ${userId}`, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ id: result[0].id, role_id: result[0].role_id });
          }
        });
      }
    }
  );
});

// almost done
// @route   DELETE /users/deleteuser/:user_id
// @desc    DELETE a users with his reviews, favorites and cart
// @access  Private
router.delete("/deleteuser/:user_id", auth, (req, res) => {
  const user_id = req.params.user_id;

  let correctDirname = path.join(__dirname, "../../../");

  db.query(`SELECT * FROM users WHERE id = ${user_id}`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const imgToDelete = result[0].avatar;
      if (fs.existsSync(`${correctDirname}/client/public/${imgToDelete}`)) {
        console.log("file exist");
        fs.unlinkSync(`${correctDirname}/client/public/${imgToDelete}`);
        db.query(`DELETE FROM users WHERE id = ${user_id}`, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            db.query(
              `DELETE FROM reviews WHERE user_id = ${user_id}`,
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  db.query(
                    `DELETE FROM favorites WHERE user_id = ${user_id}`,
                    (err, result) => {
                      if (err) {
                        console.log(err);
                      } else {
                        db.query(
                          `DELETE FROM cart WHERE user_id = ${user_id}`,
                          (err, result) => {
                            if (err) {
                              console.log(err);
                            } else {
                              db.query(
                                `DELETE FROM address WHERE user_id = ${user_id}`,
                                (err, result) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    res.send(user_id);
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        });
      } else {
        console.log("don't exist");
        db.query(`DELETE FROM users WHERE id = ${user_id}`, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            db.query(
              `DELETE FROM reviews WHERE user_id = ${user_id}`,
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  db.query(
                    `DELETE FROM favorites WHERE user_id = ${user_id}`,
                    (err, result) => {
                      if (err) {
                        console.log(err);
                      } else {
                        db.query(
                          `DELETE FROM cart WHERE user_id = ${user_id}`,
                          (err, result) => {
                            if (err) {
                              console.log(err);
                            } else {
                              db.query(
                                `DELETE FROM address WHERE user_id = ${user_id}`,
                                (err, result) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    res.send(user_id);
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  });
});

// done
// @route   Get /api/users/get-user-address
// @desc    Get address of specific user
// @access  Private
router.get("/get-user-address", auth, (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT * FROM address WHERE user_id = ${user_id} ORDER BY user_id DESC`,
    (err, result) => {
      if (err) {
        if (err.code === "ER_NO_SUCH_TABLE") {
          db.query(
            "CREATE TABLE address (id INT(11) auto_increment primary key NOT NULL, user_id INT(11) NOT NULL, first_name varchar(255) NOT NULL, last_name varchar(255) NOT NULL, phone varchar(255) NOT NULL, county varchar(255) NOT NULL, town varchar(255) NOT NULL, address varchar(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP)",
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send([]);
              }
            }
          );
        }
      } else {
        res.json(result);
      }
    }
  );
});

// almost done - de facut validarea calumea
// @route   POST /users/post-user-address
// @desc    POST new address of specific user
// @access  Private
router.post("/post-user-address", auth, (req, res) => {
  const { user_id, first_name, last_name, phone, county, town, address } =
    req.body;

  // Simple validation
  if (!first_name) {
    return res.status(400).json({ msg: "Please fill in the First Name field" });
  } else if (!last_name) {
    return res.status(400).json({ msg: "Please fill in the Last Name field" });
  } else if (!phone) {
    return res.status(400).json({ msg: "Please fill in the Phone field" });
  } else if (!county) {
    return res.status(400).json({ msg: "Please fill in the County field" });
  } else if (!town) {
    return res.status(400).json({ msg: "Please fill in the Town field" });
  } else if (!address) {
    return res.status(400).json({ msg: "Please fill in the Address field" });
  } else {
    db.query("INSERT INTO address SET ? ", req.body, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          id: result.insertId,
          user_id: user_id,
          first_name: first_name,
          last_name: last_name,
          phone: phone,
          county: county,
          town: town,
          address: address,
        });
      }
    });
  }
});

// @route   PUT /users/update-user-address
// @desc    PUT update address of specific user
// @access  Private
router.put("/update-user-address", auth, (req, res) => {
  const {
    address_id,
    user_id,
    first_name,
    last_name,
    phone,
    county,
    town,
    address,
  } = req.body;

  if (!first_name) {
    res.status(400).json({ msg: "First name field can't be empty!" });
  } else if (!last_name) {
    res.status(400).json({ msg: "Last name field can't be empty!" });
  } else if (!phone) {
    res.status(400).json({ msg: "Phone field can't be empty!" });
  } else if (!county) {
    res.status(400).json({ msg: "County field can't be empty!" });
  } else if (!town) {
    res.status(400).json({ msg: "Town field can't be empty!" });
  } else if (!address) {
    res.status(400).json({ msg: "Address field can't be empty!" });
  } else {
    db.query(
      `UPDATE address SET first_name = '${first_name}', last_name = '${last_name}', phone = '${phone}', county = '${county}', town = '${town}', address = '${address}' WHERE id = ${address_id}`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  }
});

// done
// @route   DELETE /users/:address_id/delete-user-address
// @desc    DELETE address of specific user
// @access  Private
router.delete("/:address_id/delete-user-address", auth, (req, res) => {
  const address_id = req.params.address_id;

  db.query(`DELETE FROM address WHERE id = ${address_id}`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(address_id);
    }
  });
});

// done
// @route   GET /users/loading-user-connected
// @desc    Get user data
// @access  Private
router.get("/loading-user-connected", auth, (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT user.id, user.alias, user.avatar, user.first_name, user.last_name, user.email, user.phone, user.role_id, user.created_at FROM users AS user WHERE user.id = ${user_id}`,
    (err, result) => {
      if (err) console.log(err);
      res.json(result[0]);
    }
  );
});

module.exports = router;
