import userModel from "../models/users.model.js"
import { createHash } from "../../utils.js"
import CustomError from "../errors/CustomError.js"
import { generatedUserErrorInfo } from "../errors/info.js"
import EErrors from "../errors/enums.js"

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
    if (!fullName || !email || !role || !cart) {
        CustomError.createError({
            name: "Error el crear el usuario",
            cause: generatedUserErrorInfo(user),
            message: "Error al crear el usuario",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
    const newUser = userModel.create({
        fullName,
        email,
        age,
        password: createHash(password),
        role,
        cart: cart._id,
        documents: []
    })
    return newUser
}

async function putUserById(id, user) {
    let { name,lastName,fullName,email,age,password,role,cart,documents,last_connection } = user
    if (!fullName) fullName = `${name} ${lastName}`
    if (!fullName || !email || !role || !cart) {
        CustomError.createError({
            name: "Error el actualizar el usuario",
            cause: generatedUserErrorInfo(user),
            message: "Error al actualizar el usuario",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
    const newUser = userModel.replaceOne({_id:id}, {
        fullName,
        email,
        age,
        password,
        role,
        cart: cart._id,
        documents,
        last_connection
    })
    return newUser
}

export default {
    getUserById,
    getUserByQuery,
    postUserWithCart,
    getPopulatedUserById,
    putUserById
}