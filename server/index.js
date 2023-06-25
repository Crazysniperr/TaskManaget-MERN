import express from "express";
import cors from "cors";
import session from 'express-session';
import passport from "passport";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import {listRouter} from "./src/routes/list.js"
import { authenticateToken, userRouter } from "./src/routes/auth.js";


dotenv.config();

const dbUrl = process.env.MONGODB_URL;
const port = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;





const app = express();


function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}//this is the middleware

app.use(express.json());

app.use(cors());

// app.use(session({ secret: `${JWT_SECRET}` }));
// app.use(passport.initialize());
// app.use(passport.session());

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/taskmanager',
    failureRedirect: '/auth/google/failure'
  })
);




app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});



app.get('/', (req, res) => {
    res.json('Hello, world!');
  });


app.use("/lists", listRouter);
app.use("/user", userRouter);







mongoose.connect(`${dbUrl}`,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.log('MongoDB connection error: ', err);
});

app.listen(port, () => console.log(`SERVER STARTED ${port}`));