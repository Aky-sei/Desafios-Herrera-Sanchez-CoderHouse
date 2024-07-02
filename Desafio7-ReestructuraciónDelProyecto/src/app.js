import cookieParser from 'cookie-parser'
import express from 'express'
import passport from 'passport'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import session from 'express-session'
import { Server } from 'socket.io'
import { __dirname } from './utils.js'
import messagesService from './services/message.service.js'
import initializePassport from './config/passport.config.js'
// Configuración de dotenv
import 'dotenv/config'
// Importando los routers
import ProductsRouter from './routes/products.router.js'
import CartsRouter from './routes/carts.router.js'
import SessionsRouter from './routes/sessions.router.js'
import ViewsRouter from './routes/views.router.js'

// Inicializamos el servidor
const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, console.log(`server runing on port ${PORT}`))

// Sessions middleware, usado para el login con github
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}))
// Configuración de app e inicialización de las dependencias necesarias
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
// cookieparser
app.use(cookieParser())
// handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

// Configuramos las rutas, usando un custom router
const productsRouter = new ProductsRouter()
app.use("/api/products/", productsRouter.getRouter())
const cartsRouter = new CartsRouter()
app.use("/api/carts/", cartsRouter.getRouter())
const sessionsRouter = new SessionsRouter()
app.use("/api/sessions/", sessionsRouter.getRouter())
const viewsRouter = new ViewsRouter()
app.use("/", viewsRouter.getRouter())

// Conectamos la base de datos
mongoose.connect(process.env.MONGOO_URL)

// Configuración del socket.io para el chat
const socketServer = new Server(httpServer)
socketServer.on('connection', socket => {
    // Evento correspondiente al chat, recibiendo en nuevo mensaje, añadiendolo a la base de datos.
    // Para luego volver a enviar todos los mensajes a los usuarios y actualizar la vista.
    socket.on('newMessage', async message => {
        try {
            await messagesService.postMessage(message)
            const data = await messagesService.getAllMessages()
            socketServer.emit('updateMessages', data)
        } catch(error) {
            console.error("Error en la conexión", error)
        }
    })
})