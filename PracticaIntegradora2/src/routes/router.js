import { Router } from "express"
import passport from "passport"

export default class CustomRouter{
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router
    }

    init(){}

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
                console.log(error)
                params[1].status(500).send(error)
            }
        })
    }

    generateCustomResponses(req,res,next) {
        res.sendSuccess = payload => res.send({status:"success",payload})
        res.sendServerError = error => res.status(500).send({status:"error",error})
        res.sendUserError = error => res.status(400).send({status:"error",error})
        next()
    }

    handlePolicies = policies => (req,res,next) => {
        if(policies[0] === "PUBLIC") return next()
        passport.authenticate('jwt')(req,res,next)
        console.log(req.user)
        const authHeaders = req.headers.authorization
        if (!authHeaders) return res.status(401).send({status: "error", error: "Unauthorized"})
        const token = authHeaders.split(" ")[1]
        let user = jwt.verify(token, 'claveSecreta')
        if(policies.includes(user.role.toUperCase())) return res.status(403).send({status: "error", error: "Unauthorized"})
        req.user = user
        next()
    }
}
