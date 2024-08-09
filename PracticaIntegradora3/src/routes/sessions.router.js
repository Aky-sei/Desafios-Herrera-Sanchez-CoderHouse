import passport from 'passport'
import CustomRouter from './router.js'
import sessionsController from '../controllers/sessions.controller.js'

import jwt from 'jsonwebtoken'

export default class SessionsRouter extends CustomRouter{
    init() {
        this.post('/register',["PUBLIC"], sessionsController.registerUser)
        
        this.post('/login',["PUBLIC"], sessionsController.loginFromEmailPassword)
        
        this.post('/logout',["USER", "ADMIN", "PREMIUM"], sessionsController.logout)
        
        this.get('/current',["USER", "ADMIN", "PREMIUM"], sessionsController.getCurrentUser)

        this.get('/premium/:uid',["USER", "PREMIUM"], sessionsController.changeUserRole)

        this.post('/forgotpassword',["PUBLIC"], sessionsController.sendPasswordRecoveryEmail)

        this.post('/updatepassword/:token',["PUBLIC"], sessionsController.updatePassword)
        
        // GitHub
        
        this.get('/github',["PUBLIC"], passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})
        
        this.get('/githubcallback',["PUBLIC"], passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
            const token = jwt.sign({id: req.user._id,role: req.user.role},process.env.SECRET_KEY,{expiresIn:"24h"})
            res.cookie('coderCookieToken',`bearer ${token}`,{
                maxAge:60*60*24,
                httpOnly:true
            })
            res.redirect('/profile')
        })
    }
}