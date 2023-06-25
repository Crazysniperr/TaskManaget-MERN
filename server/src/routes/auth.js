import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const secret = process.env.JWT_SECRET;

// Register a new user
router.post('/', async (req, res) => {
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

    res.status(200).json({ success: true, message: 'You have registered successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// Retrieve user name
router.get('/user', authenticateToken, async (req, res) => {  
  try {
    const userId = req.user.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ username: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password.' });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Check if the passwords match
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });

    // Return a success message along with the token
    res.json({ success: true, message: 'Login successful.', token, username: user.name });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    // You can optionally store the user object in the request for future use
    req.user = user;

    next();
  });
}

export { router as userRouter, authenticateToken };
