const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function auth(req, res, next) {
  const token = req.headers["x-access-token"];
   
  if (!token) {
    res.status(401).json({ error: "Invalid Token!" });
    return;
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "Invalid Token!" });
      return;
    }

    req.userId = decoded.id;
    next();
  });
}

module.exports = auth;
