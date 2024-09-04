import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import userModel from '../dao/models/users.model.js'
import cartModel from '../dao/models/carts.model.js'

const initializePassport = () => {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use('github', new GitHubStrategy({
        clientID:"Iv23liaarNckDS2cu6cw",
        clientSecret:'f740ab622b93f27f3198525c49fd08b016244cd5',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken,refreshToken,profile,done) => {
        try {
            const user = await userModel.findOne({email:profile._json.email}).lean()
            if (user) {
                if (!user.authMethod || user.authMethod !== 'github') return done ("Este usuario usa una autenticación por contraseña")
                return done(null, user)
            }
            const cart = await cartModel.create({products: []})
            const newUser = {
                fullName: profile._json.name,
                email: profile._json.email,
                age: 0,
                password: "",
                authMethod: "github",
                cart: cart._id
            }
            const result = await userModel.create(newUser)
            return done(null,result)
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializePassport