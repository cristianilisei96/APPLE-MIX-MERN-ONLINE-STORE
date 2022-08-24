const config = require("config");
const jwt = require("jsonwebtoken");

function tokenForRecover(req, res, next) {
  // const token = req.header("x-auth-token");
  // console.log(req.body.token);
  const token = req.body.token;

  // Check for token
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    // Verify token
    const decoded = jwt.verify(token, config.get("passwordSecret"));
    // Add user from payload
    // req.user = decoded;
    // console.log(req.user);
    next();
  } catch (e) {
    res.status(403).json({ msg: "Token is not valid" });
  }
}

module.exports = tokenForRecover;
