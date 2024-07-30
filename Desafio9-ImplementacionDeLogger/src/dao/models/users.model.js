import mongoose from "mongoose"

const userCollection = "Users"

const userSchema = new mongoose.Schema({
    fullName: {type:String, required: true},
    email: {type:String, required: true, unique: true},
    age: {type:Number},
    password: {type:String},
    role: {type:String, default: 'USER', required: true},
    // Maneja si el usuario esta vinculado a algin servicio de logeo de terceros.
    authMethod: {type:String},
    cart: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'carts',
        required: true,
        unique: true
    }
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel