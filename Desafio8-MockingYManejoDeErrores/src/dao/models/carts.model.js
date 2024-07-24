import mongoose from 'mongoose'

const cartCollection = 'carts'

// El carrito solo contiene un arreglo con los IDs de los productos correspondientes.
const cartSchema = new mongoose.Schema({
    products:[
        {
            product: {
                type:mongoose.Schema.Types.ObjectId,
                ref:'products'
            },
            quantity:Number
        }
    ]
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel