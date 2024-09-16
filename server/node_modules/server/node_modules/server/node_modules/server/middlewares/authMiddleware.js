import jwt from 'jsonwebtoken';
import conf from '../config/conf.js'; // Import your configuration file

const secret_key = conf.echoAI_Secret_Key;

// Middleware to verify the token
export const verifyUser = (req, res, next) => {
  const token = req.cookies.token // extract token from cookies
  if (!token) {
    return res.status(401).json({ Status: "Error", Message: "Unauthorized" });
  }

  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) {
      return res.status(401).json({ Status: "Error", Message : "Token is not valid" });
    }
    req.name = decoded.name;  // Attach name to the request
    req.email = decoded.email;  // Attach email to the request
    next(); // Call the next middleware or route handler
  });
};
