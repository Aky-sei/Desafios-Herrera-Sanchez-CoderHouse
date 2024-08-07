import mongoose from "mongoose"

const userCollection = "Users"

const userSchema = new mongoose.Schema({
    name: {type:String, required: true},
    lastName: {type:String},
    email: {type:String, required: true, unique: true},
    age: {type:Number},
    password: {type:String},
    role: {type:String, default: 'USER'},
    cart: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'carts'
    }
})

export const userModel = mongoose.model(userCollection, userSchema)