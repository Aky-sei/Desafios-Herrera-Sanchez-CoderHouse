import userModel from "../persistence/models/users.model.js"
import { createHash } from "../utils.js"

async function getUserById(id) {
    return await userModel.findById(id).lean()
}

async function getPopulatedUserById(id) {
    return await userModel.findById(id).populate('cart')
}

async function getUserByQuery(query) {
    return await userModel.findOne(query).lean()
}

async function postUserWithCart(user,cart) {
    let { name,lastName,fullName,email,age,password,role } = user
    if (!fullName) fullName = `${name} ${lastName}`
    if (!fullName || !email || !role || !cart) throw new Error("Por favor, llene todos los campos")
    const newUser = userModel.create({
        fullName,
        email,
        age,
        password: createHash(password),
        role,
        cart: cart._id
    })
    return newUser
}

export default {
    getUserById,
    getUserByQuery,
    postUserWithCart,
    getPopulatedUserById
}