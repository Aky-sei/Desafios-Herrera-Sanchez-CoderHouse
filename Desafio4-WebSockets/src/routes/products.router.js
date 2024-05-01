import express from 'express'
import { ProductManager } from '../classes/productManager.js'
const router =  express.Router()

const productManager = new ProductManager('./src/data/products.json')

router.get("/api/products", async (req, res)=> {
    try {
        const products = await productManager.getProducts()
        const limit = parseInt(req.query.limit)
        // Logica un poco más extensa para añadir la funcionalidad de "?limit="
        if (limit) {
            res.json({status:"success", message:products.slice(0,limit)}) 
        } else {
            res.json({status:"success", message:products}) 
        }
    } catch(error) {
        console.error("Error al obtener los productos", error)
        res.status(500).send({status:"error", error:"Error al obtener los productos"})
    }
})

router.get('/api/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProducById(parseInt(req.params.pid))
        res.json({status:"success", message:product})
    } catch (error) {
        console.error("Error al obtener el producto", error)
        res.status(500).send({status:"error", error:"Error al obtener el producto"})
    }
})

router.post('/api/products', async (req,res) => {
    try {
        await productManager.addProduct(req.body)
        res.json({status:"success", message:"Producto añadido correctamente"}) 
    } catch (error) {
        console.error("Error al agregar el producto", error)
        res.status(500).send({status:"error", error:"Error al agregar el producto"})
    }
})

router.put('/api/products/:pid', async (req,res) => {
    try {
        await productManager.updateProduct(parseInt(req.params.pid), req.body)
        res.json({status:"success", message:"Producto actualizado correctamente"}) 
    } catch (error) {
        console.error("Error al actualizar el prodcuto", error)
        res.status(500).send({status:"error", error:"Error al actualizar el producto"})
    }
})

router.delete('/api/products/:pid', async (req,res) => {
    try {
        await productManager.deleteProduct(parseInt(req.params.pid))
        res.json({status:"success", message:"Producto eliminado correctamente"}) 
    } catch (error) {
        console.error("Error al eliminar el prodcuto", error)
        res.status(500).send({status:"error", error:"Error al eliminar el producto"})
    }
})

export {router}