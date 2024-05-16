import express from 'express'
import { cartModel } from '../dao/models/cart.model.js'
const router = express.Router()

router.get("/", async (req,res) => {
    try {
        const carts = await cartModel.find()
        res.json({status: "success", payload: carts})
    } catch (error) {
        console.error("Error al obtener los carritos", error)
        res.status(500).send({status:"error", error:"Error al obtener los carritos"})
    }
})

router.post("/", async (req,res) => {
    try {
        const cart = await cartModel.create({products:[]})
        res.json({status: "success", payload: cart})
    } catch (error) {
        console.error("Error al añadir el carrito", error)
        res.status(500).send({status:"error", error:"Error al añadir el carrito"})
    }
})

router.get("/:cid", async (req,res) => {
    try {
        const cart = await cartModel.findById(req.params.cid)
        res.json({status: "success", payload: cart})
    } catch {
        console.error("Error al obtener el carrito", error)
        res.status(500).send({status:"error", error:"Error al obtener el carrito"})
    }
})

router.put("/:cid/product/:pid", async (req,res) => {
    try {
        const {products} = await cartModel.findById(req.params.cid)
        products.push(req.params.pid)
        const newCart = await cartModel.replaceOne({_id:req.params.cid}, {
            products: products
        })
        res.json({status: "success", payload: newCart})
    } catch (error) {
        console.error("Error al añadir el producto al carrito", error)
        res.status(500).send({status:"error", error:"Error al añadir el producto al carrito"})
    }
})

export {router}