import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/user.model";
import { createError } from "../utils/error.util";

passport.use(
  new GoogleStrategy(
    {
      //options for the google strategy
      callbackURL: "/api/auth/google/redirect",
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    async (accessToken, refreshToken, profile, done) => {
      //passport callback function
      try {
        const currentUser = await User.findOne({ googleId: profile.id });

        if (currentUser) {
            console.log("There is a user already",currentUser)

        } else {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(
              createError(
                "An email address is required to use this app. Please sign in with an account that allows email access.",
                403,
              ),
            );
          }
          const username = email.split("@")[0] + "_" + profile.id.slice(0, 6);

          const user = await User.create({
            name: profile.name?.givenName + " " + profile.name?.familyName,
            email,
            username,
            googleId: profile.id,
            password: `google_${profile.id}`, //dummy password for required field
            passwordConfirm: `google_${profile.id}`,
          });

                  console.log("user created", user);

        }

      } catch (error) {
        done(error as Error);
      }
    },
  ),
);
