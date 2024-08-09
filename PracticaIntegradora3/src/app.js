import cookieParser from 'cookie-parser'
import express from 'express'
import passport from 'passport'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import session from 'express-session'
import { Server } from 'socket.io'
import { __dirname, loggerMiddleware, generateCustomResponses } from './utils.js'
import initializePassport from './config/passport.config.js'
import cors from 'cors'
import configSocket from './config/socket.config.js'
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
app.use(cors())
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
// Logger
app.use(loggerMiddleware)
app.use(generateCustomResponses)

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
configSocket(socketServer)

app.get('/loggerTest', (req,res) => {
    req.logger.error("Este es un error de prubea de tipo Error")
    req.logger.info("Este es un error de prubea de tipo Info")
    req.logger.debug("Este es un error de prubea de tipo Debug")
    res.send("Prueba realizada")
})