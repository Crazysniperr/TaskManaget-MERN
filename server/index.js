import express from "express";
import cors from "cors";
import jwt from 'jsonwebtoken';
import session from 'express-session';
import passport from "passport";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import { listRouter } from "./src/routes/list.js";
import { userRouter } from "./src/routes/authnew.js";
import passportInstance from "./passportSetup.js";
import cookieParser from 'cookie-parser'; // Import the cookie-parser middleware
dotenv.config();

const dbUrl = process.env.MONGODB_URL;
const port = process.env.PORT;
const rfresh = process.env.REFRESH_TOKEN_KEY;
const refreshTokens = [];
const acess = process.env.ACCESS_TOKEN_KEY;
const app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","https://crazysniperr-listy.netlify.app", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  session({
    secret: acess,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser()); // Use cookie-parser middleware

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/user/login',
  }),
  (req, res) => {
    if (req.user) {
      const user = req.user;
      const firstName = user.name.split(' ')[0];
      const accessTokenPayload = { userId: user._id, email: user.email, name: user.name };
      const accessTokenOptions = { expiresIn: '7d' };
      const accessToken = jwt.sign(accessTokenPayload, acess, accessTokenOptions);

      const refreshTokenPayload = { userId: user._id, email: user.email, name: user.name };
      const refreshTokenOptions = { expiresIn: '7d' };
      const refreshToken = jwt.sign(refreshTokenPayload, rfresh, refreshTokenOptions);
      refreshTokens.push(refreshToken);

      // Set the access token and refresh token as cookies in the response
res.cookie('access', accessToken, { domain: 'onrender.com', httpOnly: true, secure: true, sameSite: 'None' });
      res.cookie('refresh', refreshToken, { domain: 'onrender.com', httpOnly: true, secure: true, sameSite: 'None' });
      res.cookie('name', firstName, { domain: 'onrender.com', httpOnly: true, secure: true, sameSite: 'None' });

      // Send the name in the JSON response
      res.redirect('http://localhost:5173/taskmanager');
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
);

app.get('/', (req, res) => {
  res.send('<a href="https://taskmanagermern.onrender.com/auth/google">Authenticate with Google</a>')
});

app.use("/lists", listRouter);
app.use("/users", userRouter);

mongoose.connect(`${dbUrl}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.log('MongoDB connection error: ', err);
});

app.listen(port, () => console.log(`SERVER STARTED ${port}`));
