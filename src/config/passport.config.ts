import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"

passport.use(
    new GoogleStrategy(
        {
            //options for the google strategy
            callbackURL:"/auth/google/redirect",
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        ()=>{
            //passport callback function
        }
    )
)

