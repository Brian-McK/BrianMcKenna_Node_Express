const jwt = require("jsonwebtoken");
const secretKeyJwtToken = process.env.JWT_Key;

async function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Assuming you send the token in the "Authorization" header as "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied, Token missing" });
  }

  jwt.verify(token, secretKeyJwtToken, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token, Access denied" });
    }

    // If the token is valid, you can access the decoded payload in the `decodedToken` variable
    req.user = decodedToken; // You can use this in your route handlers to access the authenticated user's information
    next();
  });
}

module.exports = { authenticateToken };
