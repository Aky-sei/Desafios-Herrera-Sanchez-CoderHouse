import express from 'express'
import { router as productsRouter } from './routes/products.router.js'
import { router as cartsRouter } from './routes/carts.router.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import { ProductManager } from './classes/productManager.js'

const productManager = new ProductManager(__dirname + '/data/products.json')
const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, console.log(`server runing on port ${PORT}`))

const socketServer = new Server(httpServer)
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use("/", viewsRouter)
app.use("/", productsRouter)
app.use("/", cartsRouter)

socketServer.on('connection', socket => {
    socket.on('addProductBtn', async product => {
        try {
            await productManager.addProduct(product)
            const data = await productManager.getProducts()
            const id = data[data.length-1].id
            socketServer.emit("addProduct", {product, id})
        } catch(error) {
            console.error("Error en la conexión", error)
        }
    })
    socket.on('deleteProductBtn', async id => {
        try {
            await productManager.deleteProduct(id)
            socketServer.emit("deleteProduct", id)
        } catch(error) {
            console.error("Error en la conexión", error)
        }
    })
})