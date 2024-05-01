import express from 'express'
import { CartManager } from "../classes/cartManager.js"
const router = express.Router()

const cartManager = new CartManager('./src/data/carts.json')

router.get("/", async (req,res) => {
    try {
        const data = await cartManager.getCarts()
        res.json({status: "success", message: data})
    } catch (error) {
        console.error("Error al obtener los carritos", error)
        res.status(500).send({status:"error", error:"Error al obtener los carritos"})
    }
})

router.post("/", async (req,res) => {
    try {
        await cartManager.addCart()
        res.json({status: "success", message: "Carrito añadido correctamente"})
    } catch (error) {
        console.error("Error al añadir el carrito", error)
        res.status(500).send({status:"error", error:"Error al añadir el carrito"})
    }
})

router.get("/:cid", async (req,res) => {
    try {
        const data = await cartManager.getCartById(parseInt(req.params.cid))
        res.json({status: "success", message: data.products})
    } catch {
        console.error("Error al obtener el carrito", error)
        res.status(500).send({status:"error", error:"Error al obtener el carrito"})
    }
})

router.post("/:cid/product/:pid", async (req,res) => {
    try {
        await cartManager.addProductToCart(parseInt(req.params.cid),parseInt(req.params.pid))
        res.json({status: "success", message: "El producto se agrego al carrito correctamente"})
    } catch (error) {
        console.error("Error al añadir el producto al carrito", error)
        res.status(500).send({status:"error", error:"Error al añadir el producto al carrito"})
    }
})

export {router}