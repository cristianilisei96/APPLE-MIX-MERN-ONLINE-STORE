const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

app.use(express.json());
app.use(fileUpload());

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  let correctDirname = path.join(__dirname, "../");

  file.mv(
    `${correctDirname}/client/public/images/products/${file.name}`,
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      res.json({
        fileName: file.name,
        filePath: `/images/products/${file.name}`,
      });
    }
  );
});

app.use("/users", require("./routes/api/users"));
app.use("/passwords", require("./routes/api/passwords"));
app.use("/categories", require("./routes/api/categories"));
app.use("/products", require("./routes/api/products"));
app.use("/reviews", require("./routes/api/reviews"));
app.use("/favorites", require("./routes/api/favorites"));
app.use("/cart", require("./routes/api/cart"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
