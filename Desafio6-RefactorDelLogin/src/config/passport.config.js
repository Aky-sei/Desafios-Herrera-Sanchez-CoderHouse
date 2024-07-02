import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { userModel } from '../dao/models/user.model.js'
import { cartModel } from '../dao/models/cart.model.js'
import { createHash, isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { name,lastName,email,age,isAdmin } = req.body
            try {
                let user = await userModel.findOne({ email: username })
                let cart = await cartModel.create({products: []})
                if (user) {
                    return done(null, false)
                }
                const newUser = {
                    name,
                    lastName,
                    email,
                    age,
                    password: createHash(password),
                    isAdmin: isAdmin==='on' ? true : false,
                    cart: cart._id
                }
                let result = await userModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error al obtener el usuario" + error)
            }
        }
    ))

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username }).populate('cart').lean()
            if (!user) {
                return done(null, "Usuario-no-encontrado")
            }
            if (!isValidPassword(user, password)) return done(null, "Constraseña-incorrecta")
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    // Gibhub

    passport.use('github', new GitHubStrategy({
        clientID:"Iv23liaarNckDS2cu6cw",
        clientSecret:'f740ab622b93f27f3198525c49fd08b016244cd5',
        callbackURL:'http://localhost:8080/api/session/githubcallback'
    }, async (accessToken,refreshToken,profile,done) => {
        console.log(profile._json)
        try {
            let user = await userModel.findOne({email:profile._json.email}).populate('cart').lean()
            let cart = await cartModel.create({products: []})
            if (!user) {
                let newUser = {
                    name: profile._json.name,
                    lastName: "",
                    email: profile._json.email,
                    age: 0,
                    password: "",
                    isAdmin: false,
                    cart: cart._id
                }
                let result = await userModel.create(newUser)
                done(null,result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializePassport