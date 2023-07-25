import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { UserModel } from './src/models/Users.js'; 
import * as dotenv from 'dotenv';
dotenv.config();
const GOOGLE_CLIENT_ID = "976561223428-ea4kfd06pemgkht7ov4pnfrf9vo75fr0.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id).then((user) => {
    done(null, user);
  }).catch((err) => {
    done(err, null);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          user = await new UserModel({
            googleId: profile.id,
            name: profile.displayName, 
            email: profile.emails[0].value,
          }).save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
