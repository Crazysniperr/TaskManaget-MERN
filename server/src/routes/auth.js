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

// let verifySession = async (req, res, next) => {
//   try {
//     let refreshToken = req.header('x-refresh-token');
//     let _id = req.header('_id');

//     let user = await UserModel.findByIdAndToken(_id, refreshToken);

//     if (!user) {
//       throw {
//         'error': 'User not found. Make sure that the refresh token and user id are correct'
//       };
//     }

//     req.user_id = user._id;
//     req.userObject = user;
//     req.refreshToken = refreshToken;

//     let isSessionValid = false;

//     user.sessions.forEach((session) => {
//       if (session.token === refreshToken) {
//         if (UserModel.hasRefreshTokenExpired(session.expiresAt) === false) {
//           isSessionValid = true;
//         }
//       }
//     });

//     if (isSessionValid) {  
//       next();
//     } else {
//       throw {
//         'error': 'Refresh token has expired or the session is invalid'
//       };
//     }
//   } catch (e) {
//     res.status(401).send(e);
//   }
// };


// router.post('/',verifySession, async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const newUser = new UserModel({ name, email, password });

//     await newUser.save();
//     const refreshToken = await newUser.createSession();
//     const accessToken = await newUser.generateAccessAuthToken();
//     const authTokens = { accessToken, refreshToken };


//     console.log(newUser); // Log the newUser object for debugging purposes

//     res
//       .header('x-refresh-token', authTokens.refreshToken)
//       .header('x-access-token', authTokens.accessToken)
//       .send(newUser);

//   } catch (e) {
//     console.error(e); // Log the error for debugging purposes
//     res.status(400).send(e);
//   }
// });




// router.post('/login',verifySession, async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await UserModel.findByCredentials(email, password);
//     const refreshToken = await user.createSession();
//     const accessToken = await user.generateAccessAuthToken();
//     const authTokens = { accessToken, refreshToken };
//     console.log(user);

//     res
//       .header('x-refresh-token', authTokens.refreshToken)
//       .header('x-access-token', authTokens.accessToken)
//       .send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });



// router.get('/me/access-token', verifySession, async (req, res) => {
//   try {
//     const accessToken = await req.userObject.generateAccessAuthToken();
//     res.header('x-access-token', accessToken).send({ accessToken });
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });







export { router as userRouter };



// const validateRegistrationInput = (data) => {
//   let errors = {};

//   if (!data.name || data.name.trim() === "") {
//     errors.name = "Name field is required";
//   }

//   if (!data.email || data.email.trim() === "") {
//     errors.email = "Email field is required";
//   }

//   if (!data.password || data.password.trim() === "") {
//     errors.password = "Password field is required";
//   }

//   return {
//     errors,
//     isValid: Object.keys(errors).length === 0,
//   };
// };

// const validateLoginInput = (data) => {
//   let errors = {};

//   if (!data.email || data.email.trim() === "") {
//     errors.email = "Email field is required";
//   }

//   if (!data.password || data.password.trim() === "") {
//     errors.password = "Password field is required";
//   }

//   return {
//     errors,
//     isValid: Object.keys(errors).length === 0,
//   };
// };

// const generateAccessToken = (user) => {
//   const payload = {
//     id: user._id,
//     name: user.name,
//     email: user.email,
//   };

//   const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION),
//   });

//   return accessToken;
// };


// const generateRefreshToken = (user) => {
//   const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_REFRESH, {
//     expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
//   });

//   return refreshToken;
// };

// const verifyToken = (req, res, next) => {
//   const accessToken = req.header("x-access-token");

//   if (!accessToken) {
//     return res.status(401).json({ error: "Access token not found" });
//   }

//   try {
//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid access token" });
//   }
// };

// const verifySession = async (req, res, next) => {
//   try {
//     const refreshToken = req.header("x-refresh-token");
//     const _id = req.header("_id");

//     // Skip verification for user registration route
//     if (!refreshToken || !_id) {
//       return next();
//     }

//     const user = await UserModel.findByIdAndToken(_id, refreshToken);

//     if (!user) {
//       throw {
//         error: "User not found. Make sure that the refresh token and user id are correct",
//       };
//     }

//     req.user_id = user._id;
//     req.userObject = user;
//     req.refreshToken = refreshToken;

//     let isSessionValid = false;

//     user.sessions.forEach((session) => {
//       if (session.token === refreshToken) {
//         if (UserModel.hasRefreshTokenExpired(session.expiresAt) === false) {
//           isSessionValid = true;
//         }
//       }
//     });

//     if (isSessionValid) {
//       next();
//     } else {
//       throw {
//         error: "Refresh token has expired or the session is invalid",
//       };
//     }
//   } catch (e) {
//     res.status(401).send(e);
//   }
// };

// router.post("/", verifySession, async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     console.log("Registration request:", req.body);

//     // Validate registration input
//     const { errors, isValid } = validateRegistrationInput(req.body);
//     if (!isValid) {
//       console.log("Validation errors:", errors);
//       return res.status(400).json(errors);
//     }

//     const newUser = new UserModel({ name, email, password });

//     await newUser.save();
//     const refreshToken = await newUser.createSession();
//     const accessToken = generateAccessToken(newUser);
//     const authTokens = { accessToken, refreshToken };

//     console.log("New user:", newUser); // Log the newUser object for debugging purposes

//     // Log in the user by sending the access token in the response
//     res
//       .header("x-refresh-token", authTokens.refreshToken)
//       .header("x-access-token", authTokens.accessToken)
//       .send({ user: newUser, accessToken: authTokens.accessToken });
      
//   } catch (e) {
//     console.error("Registration error:", e); // Log the error for debugging purposes
//     res.status(400).send(e);
//   }
// });

// router.post("/login", verifySession, async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const { errors, isValid } = validateLoginInput(req.body);
//     if (!isValid) {
//       return res.status(400).json(errors);
//     }

//     const user = await UserModel.findByCredentials(email, password);
//     const refreshToken = await user.createSession();
//     const accessToken = generateAccessToken(user);
//     const authTokens = { accessToken, refreshToken };

//     console.log(user);

//     res
//       .header("x-refresh-token", authTokens.refreshToken)
//       .header("x-access-token", authTokens.accessToken)
//       .send("LoggedIn")
//       .send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// router.get("/me/access-token", verifySession, async (req, res) => {
//   try {
//     const accessToken = generateAccessToken(req.userObject);
//     res.header("x-access-token", accessToken).send({ accessToken });
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// export { router as userRouter };