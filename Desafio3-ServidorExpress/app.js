// Se importa el ProductManager y el modulo 'express'
import { ProductManager } from './productManager.js'
import express from 'express'

// Se inicializa las constantes necesarias
const app = express()
const productManager = new ProductManager('./products.json')

app.use(express.urlencoded({extended:true}))

// Primer endpoint '/products' que usa el metodos 'getProducts' para mostrar todos los productos
app.get('/products',async (req,res) => {
    const products = await productManager.getProducts()
    // Se añade una pequeña logica para añadir un limite del productos a los query
    const limit = parseInt(req.query.limit)
    if (products) {
        if (limit) {
            res.send({status:"success", message:products.slice(0,limit)})
        } else {
            res.send({status:"success", message:products})
        }
    } else {
        // Se maneja el error con un if en caso de no poder obtener los productos
        res.status(500).send({error:"No se pudo acceder a los datos"})
    }
})

// Segundos endpoint '/products/:pid' usa el metodo 'getProductById' para obtener un porducto especifico
app.get('/products/:pid', async (req,res) => {
    const product = await productManager.getProducById(parseInt(req.params.pid))
    if (product) {
        res.send({status:"success", message:product})
    } else {
        // Nuevamente, se maneja el error con un if, en caso de no poder obtener el producto
        res.status(404).send({error:"No se encontró el producto"})
    }
})

// Se inicializa el servidor en el puerto 8080'
app.listen(8080, () => {
    console.log(`Server up on port 8080`)
  })