import messageModel from "../models/messages.model.js"

async function getAllMessages() {
    return await messageModel.find().lean()
}

async function postMessage(message) {
    const newMessage = await messageModel.create({
        user: message.user,
        message: message.message
    })
    return newMessage
}

export default {
    getAllMessages,
    postMessage
}