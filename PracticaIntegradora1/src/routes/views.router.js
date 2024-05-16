import express from 'express'
import { productModel } from '../dao/models/product.model.js'
import { messageModel } from '../dao/models/message.model.js'

const router = express.Router()

router.get('/', async (req, res) => {
    res.render('home', {
        products: await productModel.find().lean()
    })
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {
        products: await productModel.find().lean()
    })
})

// La logica correspondiente a la ruta '/chat' se deja el 'views' al ser muy simple y no tener una api.
router.get('/chat', async (req,res) => {
    res.render('chat', {
        messages: await messageModel.find().lean()
    })
})

export {router}