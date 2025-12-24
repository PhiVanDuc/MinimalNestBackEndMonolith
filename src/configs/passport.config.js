const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/api/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            const user = {
                email: profile.emails[0].value,
                username: profile.displayName,
                provider: "google"
            }

            return done(null, user);
        }
    )
);

module.exports = passport;