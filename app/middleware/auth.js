import jwt from "jsonwebtoken";
import config from "../config";

const auth = (req, res, next) => {
  console.log(req.headers);
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    req.user = jwt.verify(token, config.JwtSecret);
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

export default auth;
