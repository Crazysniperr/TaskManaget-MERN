// import mongoose from "mongoose";
// import _ from 'lodash';
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// import bcrypt from 'bcryptjs';

// const jwtSecret = "5177adsf228657sadfasdfas121dfsdf2463212266dgdsfgafjasdkljfsklfjd714892fd4065";
// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   sessions: [{
//     token: {
//       type: String,
//       required: true
//     },
//     expiresAt: {
//       type: Number,
//       required: true
//     }
//   }]
// });

// UserSchema.methods.toJSON = function () {
//   const user = this;
//   const userObject = user.toObject();
//   return _.omit(userObject, ['password', 'sessions']);
// };

// UserSchema.methods.generateAccessAuthToken = function() {
//   const user = this;
//   return new Promise((resolve, reject) => {
//     jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m" }, (err, token) => {
//       if (!err) {
//         resolve(token);
//       } else {
//         reject(err);
//       }
//     });
//   });
// };

// UserSchema.methods.generateRefreshAuthToken = function() {
//   return new Promise((resolve, reject) => {
//     crypto.randomBytes(64, (err, buf) => {
//       if (!err) {
//         const token = buf.toString('hex');
//         resolve(token);
//       } else {
//         reject(err);
//       }
//     });
//   });
// };

// UserSchema.methods.createSession = async function () {
//   try {
//     const user = this;
//     const refreshToken = await user.generateRefreshAuthToken();
//     await saveSessionToDatabase(user, refreshToken);
//     return refreshToken;
//   } catch (err) {
//     throw new Error(`Failed to save session to database.\n${err}`);
//   }
// };

// // Model methods

// UserSchema.statics.findByIdAndToken = function(_id, token) {
//   const User = this;
//   return User.findOne({
//     _id,
//     'sessions.token': token
//   });
// };

// UserSchema.statics.findByCredentials = async function(email, password) {
//   const User = this;
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error('User not found');
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     throw new Error('Invalid credentials');
//   }

//   return user;
// };

// // Middleware
// UserSchema.pre('save', function (next) {
//   const user = this;
//   const costFactor = 10;

//   if (user.isModified('password')) {
//     // if the password field has been edited/changed then run this code.

//     // Generate salt and hash password
//     bcrypt.genSalt(costFactor, (err, salt) => {
//       bcrypt.hash(user.password, salt, (err, hash) => {
//         user.password = hash;
//         next();
//       });
//     });
//   } else {
//     next();
//   }
// });

// UserSchema.statics.hasRefreshTokenExpired = function(expiresAt) {
//   const secondsSinceEpoch = Date.now() / 1000;
//   return expiresAt > secondsSinceEpoch ? false : true;
// };

// // Helper methods
// const saveSessionToDatabase = async (user, refreshToken) => {
//   try {
//     const expiresAt = generateRefreshTokenExpiryTime();

//     user.sessions.push({ 'token': refreshToken, expiresAt });

//     await user.save();
//     return refreshToken;
//   } catch (err) {
//     throw err;
//   }
// };

// const generateRefreshTokenExpiryTime = () => {
//   const daysUntilExpire = "10";
//   const secondsUntilExpire = (daysUntilExpire * 24 * 60 * 60);
//   return (Date.now() / 1000) + secondsUntilExpire;
// };

// export const UserModel = mongoose.model('User', UserSchema);



import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  googleId: String,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      // Set a custom validator function to determine password requirement
      // The password is required if the user does not have a googleId
      return !this.googleId;
    },
    default: function() {
      // Set a default value for the password for Google-authenticated users
      // You can set it to some random value or an empty string
      return this.googleId ? "" : null;
    }
  }
});
// UserSchema.methods.createRefreshToken = async function () {
//   try {
//     const user = this;
//     const refreshToken = await user.generateRefreshAuthToken();
//     user.refreshToken = refreshToken;
//     await user.save();
//     return refreshToken;
//   } catch (err) {
//     throw new Error(`Failed to create refresh token.\n${err}`);
//   }
// };

// UserSchema.methods.generateRefreshAuthToken = function() {
//   return new Promise((resolve, reject) => {
//     crypto.randomBytes(64, (err, buf) => {
//       if (!err) {
//         const token = buf.toString('hex');
//         resolve(token);
//       } else {
//         reject(err);
//       }
//     });
//   });
// };

// UserSchema.methods.generateAccessAuthToken = function() {
//   const user = this;
//   return new Promise((resolve, reject) => {
//     jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m" }, (err, token) => {
//       if (!err) {
//         resolve(token);
//       } else {
//         reject(err);
//       }
//     });
//   });
// };

// UserSchema.statics.findByCredentials = async function(email, password) {
//   const User = this;
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error('User not found');
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     throw new Error('Invalid credentials');
//   }

//   return user;
// };

// UserSchema.statics.hasRefreshTokenExpired = function(refreshToken) {
//   try {
//     const decoded = jwt.verify(refreshToken, jwtSecret);
//     return false; // Token is valid
//   } catch (err) {
//     if (err.name === 'TokenExpiredError') {
//       return true; // Token has expired
//     } else {
//       throw err;
//     }
//   }
// };

export const UserModel = mongoose.model('User', UserSchema);