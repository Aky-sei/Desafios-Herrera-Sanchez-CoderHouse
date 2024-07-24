import usersService from '../dao/services/users.service.js'
import cartsService from '../dao/services/carts.service.js'
import { isValidPassword } from '../utils.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

async function registerUser(req,res) {
    const { email } = req.body
    try {
        const user = await usersService.getUserByQuery({ email: email })
        if (user) return res.sendUserError("El correo ya está registrado")
        const cart = await cartsService.postCart({})
        const newUser = await usersService.postUserWithCart(req.body,cart)
        res.sendSuccess(newUser)
    } catch (error) {
        res.sendServerError("Error al registrar al usuario", error)
    }
}

async function loginFromEmailPassword(req,res) {
    try {
        const {email,password} = req.body
        const user = await usersService.getUserByQuery({ email: email })
        if (!user) return res.sendUserError("Usuario-no-encontrado")
        if (user.linked) return res.sendUserError("El usuario usa un autenticación de terceros")
        if (!isValidPassword(user, password)) return res.sendUserError("Contraseña-incorrecta")
        const token = jwt.sign({id: user._id,role: user.role},process.env.SECRET_KEY,{expiresIn:"24h"})
        res.cookie('coderCookieToken',`bearer ${token}`,{
            maxAge: 60*60*24*1000,
            httpOnly:true
        })
        res.sendSuccess(token)
    } catch (error) {
        res.sendServerError("Error al lograr al usuario", error)
    }
}

async function logout(req,res) {
    res.clearCookie('coderCookieToken')
    req.session.destroy()
    res.sendSuccess("Deslogeado")
}

async function getCurrentUser(req,res) {
    try {
        const user = await usersService.getPopulatedUserById(req.user.id)
        const userToSend = {
            fullName: user.fullName,
            email: user.email,
            role: user.role
        }
        res.sendSuccess(userToSend)
    } catch (error) {
        res.sendServerError("Error al recueperar al usuario", error)
    }
}


export default {
    registerUser,
    loginFromEmailPassword,
    logout,
    getCurrentUser
}