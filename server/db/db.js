const mysql = require("mysql");

// DB Config
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "applemix",
  port: 8889,
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("mysql is connected...");
  }
});

module.exports = db;
