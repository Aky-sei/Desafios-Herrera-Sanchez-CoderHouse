import mongoose from 'mongoose'

const cartCollection = 'carts'

// El carrito solo contiene un arreglo con los IDs de los productos correspondientes.
const cartSchema = new mongoose.Schema({
    products:{type:Array, required: true}
})

export const cartModel = mongoose.model(cartCollection, cartSchema)