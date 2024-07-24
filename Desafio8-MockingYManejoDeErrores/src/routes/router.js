import { Router } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

// Creamos el custom router
export default class CustomRouter{
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router
    }

    init(){}

    // Definimos los metodos de CRUD, incluyendo los middlewares que querremos siempre
    get(path,policies,...callbacks) {
        this.router.get(path,this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks))
    }
    post(path,policies,...callbacks) {
        this.router.post(path,this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks))
    }
    put(path,policies,...callbacks) {
        this.router.put(path,this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks))
    }
    delete(path,policies,...callbacks) {
        this.router.delete(path,this.handlePolicies(policies),this.generateCustomResponses,this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async(...params) => {
            try {
                await callback.apply(this,params)
            } catch (error) {
                params[1].sendServerError("Error interno del router", error)
            }
        })
    }

    generateCustomResponses(req,res,next) {
        res.sendSuccess = payload => res.json({status:"success",payload})
        res.sendServerError = (errorMessage,error) => {
            console.error(`${errorMessage}:
                `, error)
            res.status(500).json({status:"error",errorMessage})
        }
        res.sendUserError = error => res.status(400).json({status:"error",error})
        next()
    }

    // Manejamos los accesos de los usuarios con jwt
    handlePolicies = policies => (req,res,next) => {
        if(policies[0] === "PUBLIC") {
            const authHeaders = req.cookies.coderCookieToken || null
            if (!authHeaders) return next()
            const token = authHeaders.split(" ")[1]
            const user = jwt.verify(token, process.env.SECRET_KEY)    
            req.user = user
            return next()
        }
        const authHeaders = req.cookies.coderCookieToken || null
        if (!authHeaders) return res.status(401).send({status: "error", error: "Unauthorized"})
        const token = authHeaders.split(" ")[1]
        const user = jwt.verify(token, process.env.SECRET_KEY)
        if(!policies.includes(user.role.toUpperCase())) return res.status(403).send({status: "error", error: "Unauthorized"})
        req.user = user
        next()
    }
}