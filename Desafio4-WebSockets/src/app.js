import express from 'express'
import { router as productsRouter } from './routes/products.router.js'
import { router as cartsRouter } from './routes/carts.router.js'
// Añadidos los imports necesarios para añadis handlebars y sockets
import { router as viewsRouter } from './routes/views.router.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
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
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

// Logica para los sockets del lado del servidos.
// En ambos casos, se toma el evento junto con la información necesaria y, tras realizar los procesos necesarios al 'products.json'
// se envia un mensaje al cliente para que actualize sus datos.
socketServer.on('connection', socket => {
    socket.on('addProductBtn', async product => {
        try {
            await productManager.addProduct(product)
            const data = await productManager.getProducts()
            socketServer.emit("updateProducts", data)
        } catch(error) {
            console.error("Error en la conexión", error)
        }
    })
    socket.on('deleteProductBtn', async id => {
        try {
            await productManager.deleteProduct(id)
            const data = await productManager.getProducts()
            socketServer.emit("updateProducts", data)
        } catch(error) {
            console.error("Error en la conexión", error)
        }
    })
})