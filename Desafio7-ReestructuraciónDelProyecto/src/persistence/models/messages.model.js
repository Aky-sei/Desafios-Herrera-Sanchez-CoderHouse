import mongoose from 'mongoose'

const messageColection = 'messages'

// Los mensajes tienen un 'user' y un 'message'.
const messsageSchema = new mongoose.Schema({
    user:{type:String, required: true},
    message:{type:String, required: true},
})

const messageModel = mongoose.model(messageColection, messsageSchema)

export default messageModel