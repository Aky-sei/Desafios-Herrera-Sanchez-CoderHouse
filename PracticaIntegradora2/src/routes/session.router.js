import passport from 'passport'
import CustomRouter from './router.js'
import { isValidPassword } from '../utils.js'
import { userModel } from '../dao/models/user.model.js'
import jwt from 'jsonwebtoken'

export default class SessionRouter extends CustomRouter{
    init() {
        this.post('/register',["PUBLIC"], passport.authenticate('register',{failureRedirect:'/failregister'}) , async (req,res) => {
            res.redirect('/login')
        })
        this.get('/failregister',["PUBLIC"], async(req,res) => {
            res.json("usuario ya registrado")
        })
        
        this.post('/login',["PUBLIC"], async (req, res) => {
            try {
                const {email,password} = req.body
                const user = await userModel.findOne({ email: email }).populate('cart').lean()
                if (!user) res.sendUserError("Usuario-no-encontrado")
                if (!isValidPassword(user, password)) res.sendUserError("Contraseña-incorrecta")
                let token = jwt.sign({email,password},'claveSecreta',{expiresIn:"24h"})
                res.cookie('coderCookieToken',token,{
                    maxAge:60*60*24,
                    httpOnly:true
                })
                res.sendSuccess(token)
            } catch (error) {
                console.log(error)
                res.sendServerError(error)
            }
        })
        
        this.post('/logout',["PUBLIC"], (req,res) => {
            req.session.destroy(res.redirect('/login'))
        })
        
        this.get('/current',["PUBLIC"], (req,res) => {
            res.json(req.user)
        })
        
        // GitHub
        
        this.get('/github',["PUBLIC"], passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})
        
        this.get('/githubcallback',["PUBLIC"], passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
            let token = jwt.sign({email,password},'claveSecreta',{expiresIn:"24h"})
            res.cookie('coderCookieToken',token,{
                maxAge:60*60*24,
                httpOnly:true
            })
            res.sendSuccess(token).redirect('/profile')
        })
    }
}