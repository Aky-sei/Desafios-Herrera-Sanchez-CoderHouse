import express from 'express'
import { router as productsRouter } from './routes/products.router.js'
import { router as cartsRouter } from './routes/carts.router.js'
import { router as viewsRouter } from './routes/views.router.js'
import { router as sessionRouter } from './routes/session.router.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import { productModel } from './dao/models/product.model.js'
import { messageModel } from './dao/models/message.model.js'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import session from 'express-session'

const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, console.log(`server runing on port ${PORT}`))

const socketServer = new Server(httpServer)
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ 
        mongoUrl: 'mongodb+srv://diegohs:diegohs0204@codercluster.b2nuohi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderCluster',
        ttl: 60*60 // Un dia
    })
}))
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/session", sessionRouter)

mongoose.connect('mongodb+srv://diegohs:diegohs0204@codercluster.b2nuohi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderCluster')

socketServer.on('connection', socket => {
    socket.on('addProductBtn', async product => {
        try {
            await productModel.create(product)
            const data = await productModel.find()
            socketServer.emit("updateProducts", data)
        } catch(error) {
            console.error("Error en la conexión", error)
        }
    })
    socket.on('deleteProductBtn', async id => {
        try {
            await productModel.deleteOne({_id:id})
            const data = await productModel.find()
            socketServer.emit("updateProducts", data)
        } catch(error) {
            console.error("Error en la conexión", error)
        }
    })
    // Evento correspondiente al chat, recibiendo en nuevo mensaje, añadiendolo a la base de datos.
    // Para luego volver a enviar todos los mensajes a los usuarios y actualizar la vista.
    socket.on('newMessage', async message => {
        try {
            await messageModel.create(message)
            const data = await messageModel.find()
            socketServer.emit('updateMessages', data)
        } catch(error) {
            console.error("Error en la conexión", error)
        }
    })
})