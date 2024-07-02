import cartModel from "../persistence/models/carts.model.js"

// Definimos las funciones para el servicio de carts
async function getAllCarts() {
    return await cartModel.find().lean()
}

async function getCartById(id) {
    return await cartModel.findOne({_id:id})
}
async function getPopulatedCartById(id) {
    return await cartModel.findById(id).populate('products.product').lean()
}

async function postCart(cart) {
    const { products } = cart
    if(!products) {
        const newCart = await cartModel.create({products: []})
        return newCart
    } else {
        const newCart = await cartModel.create({products})
        return newCart
    }
}

async function putCartById(id, cart) {
    const { products } = cart
    if(!products) {
        const newCart = await cartModel.updateOne({_id:id}, {products: []})
        return newCart
    } else {
        const newCart = await cartModel.updateOne({_id:id}, {products})
        return newCart
    }
}

async function emptyCartById(id) {
    return await putCartById(id, {products: []}) 
}

// Exportamos las funciones
export default {
    getAllCarts,
    getCartById,
    getPopulatedCartById,
    postCart,
    putCartById,
    emptyCartById
}