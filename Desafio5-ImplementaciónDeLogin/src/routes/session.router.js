import express from 'express'
import { userModel } from '../dao/models/user.model.js'
import { cartModel } from '../dao/models/cart.model.js'
const router = express.Router()

router.post('/register', async (req,res) => {
    try {
        const {name,lastName,email,age,password,isAdmin} = req.body
        const cart = await cartModel.create({products: []})
        await userModel.create({
            "name": name,
            "lastName": lastName,
            "email": email,
            "age": age,
            "password": password,
            "isAdmin": isAdmin==='on' ? true : false,
            "cart": cart._id
        })
        res.redirect('/login')
    } catch (error) {
        console.error("Error al registrar el usuario", error)
        res.status(500).send({status:"error", error:"Error al registrar el usuario"})
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email: email}).populate('cart').lean()
        if (user) {
            if (password == user.password) {
                req.session.user = {...user}
                res.json({status: "success"})
            } else {
                res.json({status: "error", error: "Constraseña-incorrecta"})
            }
        } else {
            res.json({status: "error", error: "Usuario-no-encontrado"})
        }
    } catch (error) {
        console.log("asdasds")
        console.error("error al logearse", error)
    }
})

router.post('/logout', (req,res) => {
    req.session.destroy(res.redirect('/login'))
})

export {router}