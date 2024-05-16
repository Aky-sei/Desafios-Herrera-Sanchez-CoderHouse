import express from 'express'
import { productModel } from '../dao/models/product.model.js'
const router =  express.Router()

router.get("/", async (req, res)=> {
    try {
        const limit = req.query.limit
        let products = []
        if(limit) {
            products = await productModel.find().limit(limit)
        } else {
            products = await productModel.find()
        }
        res.json({status:"success",payload:products})
    } catch (error) {
        console.error("Error al obtener los productos", error)
        res.status(500).send({status:"error", error:"Error al obtener los productos"})
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid)
        res.json({status:"success", payload:product})
    } catch (error) {
        console.error("Error al obtener el producto", error)
        res.status(500).send({status:"error", error:"Error al obtener el producto"})
    }
})

router.post('/', async (req,res) => {
    try {
        const {title,description,code,price,status,stock,category,thumbnail} = req.body
        const product = await productModel.create({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        })
        res.json({status:"success", payload:product}) 
    } catch (error) {
        console.error("Error al agregar el producto", error)
        res.status(500).send({status:"error", error:"Error al agregar el producto"})
    }
})

router.put('/:pid', async (req,res) => {
    try {
        const {title,description,code,price,status,stock,category,thumbnail} = req.body
        if(!title||!description||!code||!price||!status||!stock||!category) {
            throw new Error("Por favor, llene todos los campos")
        }
        const newProduct = await productModel.replaceOne({_id:req.params.pid}, {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        })
        res.json({status:"success", payload:newProduct}) 
    } catch (error) {
        console.error("Error al actualizar el prodcuto", error)
        res.status(500).send({status:"error", error:"Error al actualizar el producto"})
    }
})

router.delete('/:pid', async (req,res) => {
    try {
        const delProduct = await productModel.deleteOne({_id:req.params.pid})
        res.json({status:"success", payload:delProduct}) 
    } catch (error) {
        console.error("Error al eliminar el prodcuto", error)
        res.status(500).send({status:"error", error:"Error al eliminar el producto"})
    }
})

export {router}