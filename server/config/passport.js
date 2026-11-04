import passport from "passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { User } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
    new LinkedInStrategy(
        {
            clientID: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            callbackURL: `${process.env.APP_URL}/api/auth/linkedin/callback`,
            scope: ["openid", "profile", "email"],
            // LinkedIn now uses OIDC — must point to the userinfo endpoint
            profileURL: "https://api.linkedin.com/v2/userinfo",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // OIDC userinfo returns a flat object — normalize it
                const email =
                    profile.emails?.[0]?.value ||   // passport-linkedin-oauth2 shape
                    profile._json?.email ||          // OIDC flat shape fallback
                    profile.email;

                const linkedinId =
                    profile.id ||
                    profile._json?.sub;

                const displayName =
                    profile.displayName ||
                    profile._json?.name ||
                    [profile._json?.given_name, profile._json?.family_name].filter(Boolean).join(" ");

                const photo =
                    profile.photos?.[0]?.value ||
                    profile._json?.picture;

                if (!email) return done(new Error("LinkedIn did not return an email address. Make sure 'email' scope is approved in your LinkedIn app."), null);

                let user = await User.findOne({
                    $or: [{ linkedinId }, { email }],
                });

                if (!user) {
                    user = new User({
                        name: displayName,
                        email,
                        linkedinId,
                        profileImage: photo,
                        status: "pending",
                        isEmailVerified: false,
                    });
                    await user.save();
                } else {
                    // Keep profile image & LinkedIn ID in sync
                    if (!user.linkedinId) user.linkedinId = linkedinId;
                    if (photo && !user.profileImage) user.profileImage = photo;
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
