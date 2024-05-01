import express from 'express'
import { promises as fs } from 'fs'

const router = express.Router()

router.get('/', async (req, res) => {
    res.render('home', {
        products: JSON.parse(await fs.readFile('src/data/products.json','utf8'))
    })
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {
        products: JSON.parse(await fs.readFile('src/data/products.json','utf8'))
    })
})

export default router