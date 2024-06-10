import express from 'express'
import passport from 'passport'
const router = express.Router()

router.post('/register', passport.authenticate('register',{failureRedirect:'/failregister'}) , async (req,res) => {
    res.redirect('/login')
})
router.get('/failregister', async(req,res) => {
    res.json("usuario ya registrado")
})

router.post('/login', passport.authenticate('login') , async (req, res) => {
    // Se cambia un poco la logida par reutilizar la logice previa de "contraseña incorrecta" y "usuario no encontrado"
    if (req.user !== "Usuario-no-encontrado" && req.user !== "Constraseña-incorrecta") {
        console.log(req.user)
        req.session.user = {...req.user}
        res.json({status:"success"})
    } else {
        res.json({status:"error", error:req.user})
    }
})

router.post('/logout', (req,res) => {
    req.session.destroy(res.redirect('/login'))
})

// GitHub

router.get('/github', passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    req.session.user = {...req.user}
    res.redirect('/profile')
})

export {router}