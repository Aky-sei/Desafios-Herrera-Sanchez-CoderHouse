import { cartModel } from '../dao/models/cart.model.js'
import CustomRouter from './router.js'

export default class CartsRouter extends CustomRouter{
    init() {
        this.get("/",["PUBLIC"], async (req,res) => {
            console.log("asdasd")
            try {
                const carts = await cartModel.find()
                res.sendSuccess(carts)
            } catch (error) {
                console.error("Error al obtener los carritos", error)
                res.sendServerError(error)
            }
        })
        
        this.post("/",["PUBLIC"], async (req,res) => {
            try {
                const cart = await cartModel.create({products:[]})
                res.sendSuccess(cart)
            } catch (error) {
                console.error("Error al añadir el carrito", error)
                res.status(500).send({status:"error", error:"Error al añadir el carrito"})
            }
        })
        
        this.get("/:cid",["PUBLIC"], async (req,res) => {
            try {
                const cart = await cartModel.findOne({_id: req.params.cid}).populate('products.product')
                res.json({status: "success", payload: cart})
            } catch {
                console.error("Error al obtener el carrito", error)
                res.status(500).send({status:"error", error:"Error al obtener el carrito"})
            }
        })
        
        // Metodo post, no requerido para le entrega, pero usado para añadir los objetos alc arrito desde el HTML. 
        this.post("/:cid",["PUBLIC"], async (req,res) => {
            try {
                const {products} = await cartModel.findOne({_id:req.params.cid})
                const found = products.find(prod => prod.product._id == req.body.id)
                if (found) {
                    throw new Error("El producto ya existe en ese carrito")
                } else {
                    products.push({
                        product:req.body.id,
                        quantity: 1
                    })
                    await cartModel.updateOne({_id:req.params.cid}, {
                        products: products
                    })
                    res.json({status: "success", payload: products})
                }
            } catch (error) {
                console.error("Error al añadir el producto al carrito", error)
                res.status(500).send({status:"error", error:"Error al añadir el producto al carrito"})
            }
        })
        
        this.put("/:cid",["PUBLIC"], async (req,res) => {
            try {
                const products = req.body
                const newCart = await cartModel.updateOne({_id:req.params.cid}, {products:products})
                res.json({status: "success", payload: newCart})
            } catch (error) {
                console.error("Error al actualizar los productos del carrito", error)
                res.status(500).send({status:"error", error:"Error al actualizar los productos del carrito"})
            }
        })
        
        this.delete("/:cid",["PUBLIC"], async (req,res) => {
            try {
                const update = await cartModel.updateOne({_id:req.params.cid}, {products:[]})
                res.json({status: "success", payload: update})
            } catch (error) {
                console.error("Error al eliminar los productos del carrito", error)
                res.status(500).send({status:"error", error:"Error al eliminar los productos del carrito"}) 
            }
        })
        
        this.delete("/:cid/products/:pid",["PUBLIC"], async (req,res) => {
            try {
                const {products} = await cartModel.findOne({_id: req.params.cid})
                const i = products.findIndex(prod => prod.product == req.params.pid)
                products.splice(i,1)
                await cartModel.updateOne({_id:req.params.cid}, {products:products})
                res.json({status: "success", payload: products})
            } catch (error) {
                console.error("Error al eliminar un producto del carrito", error)
                res.status(500).send({status:"error", error:"Error al eliminar un producto del carrito"})
            }
        })
        
        this.put("/:cid/products/:pid",["PUBLIC"], async (req,res) => {
            try {
                const {products} = await cartModel.findOne({_id: req.params.cid}).lean()
                const i = products.findIndex(prod => prod.product == req.params.pid)
                products[i].quantity = req.body.quantity
                await cartModel.updateOne({_id:req.params.cid}, {products:products})
                res.json({status: "success", payload: products})
            } catch (error) {
                console.error("Error al actualizar la cantidad del producto", error)
                res.status(500).send({status:"error", error:"Error al actualizar la cantidad del producto"})
            }
        })
    }
}