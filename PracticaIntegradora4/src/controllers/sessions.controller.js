import usersService from '../dao/services/users.service.js'
import cartsService from '../dao/services/carts.service.js'
import nodemailer from 'nodemailer'
import { createHash, isValidPassword } from '../utils.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const transport = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth:{
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
})

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
        const token = jwt.sign({id: user._id},process.env.SECRET_KEY,{expiresIn:"24h"})
        res.cookie('coderCookieToken',`bearer ${token}`,{
            maxAge: 60*60*24*1000,
            httpOnly:true
        })
        await usersService.putUserById(user._id,{
            ...user,
            last_connection: new Date()
        })
        res.sendSuccess(token)
    } catch (error) {
        res.sendServerError("Error al lograr al usuario", error)
    }
}

async function logout(req,res) {
    let user =  await usersService.getUserById(req.user.id)
    await usersService.putUserById(req.user.id,{
        ...user,
        last_connection: new Date()
    })
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

async function sendPasswordRecoveryEmail(req,res) {
    try {
        const user = await usersService.getUserByQuery({email:req.body.email})
        if (!user) return res.sendUserError("No hay ningun usuario cone se correo")
        const token = jwt.sign({id: user._id},process.env.SECRET_KEY,{expiresIn:"1h"})        
        transport.sendMail({
        from: `CoderHouse ${process.env.GMAIL}`,
        to: user.email,
        subject: 'Correo de recuperación de contraseña',
        html: `
            <div>
                <h1>Para reestablecer su contraseña, por favor, ingrese a este enlace:<h1/>
                <a href="http://localhost:8080/updatepassword/${token}">Reset Password</a>
            <div/>
        `
        })
        res.sendSuccess("Correo enviado")
    } catch (error) {
        res.sendServerError("Error al solicitar el correo de recuperación", error)
    }
}

async function updatePassword(req,res) {
    try {
        const userID = jwt.verify(req.params.token, process.env.SECRET_KEY).id
        const user = await usersService.getUserById(userID)
        console.log(user)
        await usersService.putUserById(userID, {
            ...user,
            password: createHash(req.body.password)
        })
        res.send("Se actualizó la contraseña")
    } catch (error) {
        res.sendServerError("Error al actualizar la contraseña", error)
    }
}

export default {
    registerUser,
    loginFromEmailPassword,
    logout,
    getCurrentUser,
    sendPasswordRecoveryEmail,
    updatePassword
}