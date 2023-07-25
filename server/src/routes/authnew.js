import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/Users.js"; // Replace '../path/to/userModel' with the actual path to your user model
import auth from "../middleware/authmiddleware.js"
import * as dotenv from "dotenv";
let refreshTokens = [];
dotenv.config();
const router = express.Router();
const acess = process.env.ACCESS_TOKEN_KEY;
const rfresh = process.env.REFRESH_TOKEN_KEY;


//   async function auth(req, res, next) {
//     let token = req.headers["authorization"];
//     token = token.split(" ")[1]; //Access token

//     jwt.verify(token, acess, async (err, user) => {
//         if (user) {
//             req.user = user;
//             next();
//         } else if (err.message === "jwt expired") {
//             return res.json({
//                 success: false,
//                 message: "Access token expired"
//             });
//         } else {
//             console.log(err);
//             return res
//                 .status(403)
//                 .json({ err, message: "User not authenticated" });
//         }
//     });
// }

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.status(400).json({ message: 'Please provide a name, email, and password.' });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'The email already exists. You can directly login.' });
    }
   
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();
    console.log(newUser);
    // Generate access token
    const accessToken = jwt.sign({ email, name }, acess, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ email, name }, rfresh, { expiresIn: "7d" });
    refreshTokens.push(refreshToken);
    const firstName = user.name.split(' ')[0];
    return res.status(201).json({
      accessToken,
      refreshToken,
      firstName
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User Login (with Access and Refresh Token)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate access token
    const accessToken = jwt.sign({ userId: user._id, email, name: user.name }, acess, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ userId: user._id, email, name: user.name  }, rfresh, { expiresIn: "7d" });
    refreshTokens.push(refreshToken);
    const firstName = user.name.split(' ')[0];
    return res.status(200).json({
      accessToken,
      refreshToken,
      firstName

    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});
// Token Refresh
router.post("/refresh", (req, res, next) => {
  const refreshToken = req.body.token;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
      return res.json({ message: "Refresh token not found, login again" });
  }

  // If the refresh token is valid, create a new accessToken and return it.
  jwt.verify(refreshToken, rfresh, (err, user) => {
      if (!err) {
          const accessToken = jwt.sign({ username: user.name }, acess, {
              expiresIn: "7d"
          });
          return res.json({ success: true, accessToken });
      } else {
          return res.json({
              success: false,
              message: "Invalid refresh token"
          });
      }
  });
});

// Protected Route (User Authentication)
router.post("/protect", auth, async (req, res) => {
  const userId = req.userId; // Access the user ID from the request object
  res.json({ userId });

});

router.post("/check", async(req, res) => {
  try {
    const userId = req.body;
    const user = await UserModel.findById(userId)
    res.json(user)
  } catch (error) {
    res.json(error)
    
  }
})

// Middleware to authenticate access token

export { router as userRouter };
