import cartsService from '../dao/services/carts.service.js'
import ticketsService from '../dao/services/tickets.service.js'
import usersService from '../dao/services/users.service.js'
import nodemailer from 'nodemailer'
import 'dotenv/config'
import productsService from '../dao/services/products.service.js'

const transport = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth:{
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
})

// Definimos las funciones para el controllador de los carritos
async function getAllCarts(req,res) {
    try {
        const carts = await cartsService.getAllCarts()
        res.sendSuccess(carts)
    } catch (error) {
        res.sendServerError("Error al obtener los carritos", error)
    }
}

async function getCartByParamsId(req,res) {
    try {
        const cart = await cartsService.getPopulatedCartById(req.params.cid)
        if (cart) {
            res.sendSuccess(cart)
        } else {
            res.sendUserError("El carrito no existe")
        }
    } catch (error) {
        res.sendServerError("Error al obtener el carrito", error)
    }
}

async function postProductToCartByParamsId(req,res) {
    try {
        const {products} = await cartsService.getCartById(req.params.cid)
        if (req.user.role === "PREMIUM") {
            const prod = await productsService.getProductById(req.params.pid)
            if (prod.owner === req.user.id) return res.sendUserError("No es posible comprar un producto que te pertenece")
            }
        const found = products.find(prod => prod.product._id == req.params.pid)
        if (found) return res.sendUserError("El producto ya existe en ese carrito")
        products.push({
            product:req.params.pid,
            quantity: 1
        })
        await cartsService.putCartById(req.params.cid, {products})
        res.sendSuccess(products)
    } catch (error) {
        res.sendServerError("Error al añadir el producto al carrito", error)
    }
}

async function putCartByParamsId(req,res) {
    try {
        const newCart = await cartsService.putCartById(req.params.cid, {products:req.body})
        res.sendSuccess(newCart)
    } catch (error) {
        res.sendServerError("Error al actualizar los productos del carrito", error)
    }
}

async function deleteCartByParamsId(req,res) {
    try {
        const update = await cartsService.emptyCartById(req.params.cid)
        res.sendSuccess(update)
    } catch (error) {
        res.sendServerError("Error al eliminar los productos del carrito", error)
    }
}

async function deleteProductFromCartByParamsId(req,res) {
    try {
        const {products} = await cartsService.getCartById(req.params.cid)
        const i = products.findIndex(prod => prod.product == req.params.pid)
        products.splice(i,1)
        await cartsService.putCartById(req.params.cid, {products})
        res.sendSuccess(products)
    } catch (error) {
        res.sendServerError("Error al eliminar un producto del carrito", error)
    }
}

async function putProductFromCartByParamsId(req,res) {
    try {
        const {products} = await cartsService.getCartById(req.params.cid)
        const i = products.findIndex(prod => prod.product == req.params.pid)
        if(i < 0) {
            res.sendUserError("Ese producto no esta en ese carrito")
        } else {
            products[i].quantity = req.body.quantity
            await cartsService.putCartById(req.params.cid, {products})
            res.sendSuccess(products)
        }
    } catch (error) {
        res.sendServerError("Error al actualizar la cantidad del producto", error)
    }
}

async function purchaseCartByParamsId(req,res) {
    try {
        const cart = await cartsService.getPopulatedCartById(req.params.cid)
        if (!cart) return res.sendUserError("No se puede comrpar un carro vacio")
        const user = await usersService.getUserById(req.user.id)
        let amount = 0
        cart.products.forEach(prod => amount += prod.product.price*prod.quantity)
        const ticket =  {
            code: `${user.email}-${new Date()}`,
            purchase_datetime: new Date(),
            amount: amount,
            purchaser: user.email
        }
        const newTicket = await ticketsService.postTicket(ticket) 
        transport.sendMail({
            from: `CoderHouse ${process.env.GMAIL}`,
            to: user.email,
            subject: 'Este es un correo de prubea de CoderHouse',
            html: `
                <div>
                    <h1>Su compra se ha completado<h1/>
                    <p>Total de la compra: ${amount}<p/>
                <div/>
            `
        })
        await cartsService.emptyCartById(req.params.cid)
        res.sendSuccess(newTicket)
    } catch (error) {
        res.sendServerError("Error al procesar la compra", error)
    }
}

// Exportamos las funciones
export default {
    getAllCarts,
    getCartByParamsId,
    postProductToCartByParamsId,
    putCartByParamsId,
    deleteCartByParamsId,
    deleteProductFromCartByParamsId,
    putProductFromCartByParamsId,
    purchaseCartByParamsId
}