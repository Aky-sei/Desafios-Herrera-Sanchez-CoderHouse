import express from 'express'
import ProductsRouter from './routes/products.router.js'
import CartsRouter from './routes/carts.router.js'
import ViewsRouter from './routes/views.router.js'
import SessionRouter from './routes/session.router.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import { productModel } from './dao/models/product.model.js'
import { messageModel } from './dao/models/message.model.js'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import cookieParser from 'cookie-parser'

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

initializePassport()
app.use(passport.initialize())
app.use(cookieParser())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

const viewsRouter = new ViewsRouter()
app.use("/", viewsRouter.getRouter())
const productsRouter = new ProductsRouter()
app.use("/api/products", productsRouter.getRouter())
const cartsRouter = new CartsRouter()
app.use("/api/carts", cartsRouter.getRouter())
const sessionRouter = new SessionRouter()
app.use("/api/session", sessionRouter.getRouter())

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