import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { promisify } from "util";

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_KEY;

export default async function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const decoded = await promisify(jwt.verify)(token, accessTokenSecret);
    req.userId = decoded.userId; // Add the decoded user ID to the request object
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.json({
        success: false,
        message: "Access token expired",
      });
    } else {
      console.log(err);
      return res.status(403).json({
        err,
        message: "User not authenticated",
      });
    }
  }
}
