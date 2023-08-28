import passport from "passport";
import GitHubStrategy from "passport-github2";
import userModel from "../models/users.model.js";

//Configuracion de passport:
export const initializePassport = () => {
    passport.use(
        "github",
        new GitHubStrategy({
            clientID: "Iv1.25b80fa8e7fd5a1c",
            clientSecret: "7933d37c7996fd03dbc21291779d727daf9fd1dd",
            callbackURL: "http://localhost:8080/api/session/githubcallback"
        }, async (accessToken, refreshToken, profile, done) => {
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile.username,
                    last_name: 'Test',
                    email: profile.profileUrl,
                    age: 25,
                    password: '12345'
                }
                const result = await userModel.create(newUser)
                done(null, result)
            } else {
                done(null, false)
            }
        })
    )

    //configuracion que siempre debe estar:
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user)
    });
};