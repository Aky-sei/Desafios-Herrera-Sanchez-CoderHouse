import { ProductManager,Product } from './productManager.js'
import express from 'express'
const app = express()
const productManager = new ProductManager('./products.json')

app.use(express.urlencoded({extended:true}))

app.get('/products',async (req,res) => {
    const products = await productManager.getProducts()
    const limit = req.query.limit
    if (products) {
        if (limit) {
            res.send({status:"success", message:products.slice(0,limit)})
        } else {
            res.send({status:"success", message:products})
        }
    } else {
        res.status(500).send({status:"error", error:"No se pudo acceder a los datos"})
    }
})

app.get('/products/:pid', async (req,res) => {
    const product = await productManager.getProducById(parseInt(req.params.pid))
    if (product) {
        res.send({status:"success", message:product})
    } else {
        res.status(404).send({status:"error", error:"No se encontró el producto"})
    }
})

app.listen(8080, () => {
    console.log(`Server up on port 8080`)
  })