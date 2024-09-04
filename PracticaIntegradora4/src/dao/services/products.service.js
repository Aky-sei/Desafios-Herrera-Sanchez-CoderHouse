import CustomError from "../errors/CustomError.js"
import EErrors from "../errors/enums.js"
import { generateProductErrorInfo } from "../errors/info.js"
import productModel from "../models/products.model.js"

// Funciones necesarias para el servicio de productos
async function getPaginatedProducts(queryParams) {
    const { limit = 10, page = 1, sort, query = 0} = queryParams
    return await productModel.paginate(JSON.parse(query), {
        limit: limit,
        page: page,
        sort: sort == "asc" ? 'price code' : sort == "desc" ? '-price code' : {},
        lean: true
    })
}

async function getProductById(id) {
    try {
        return  await productModel.findById(id)
    } catch(error) {
        return undefined
    }
}

async function postProduct(product) {
    const {title,description,code,price,status,stock,category,thumbnail,owner} = product
    if(!title||!description||!code||!price||!status||!stock||!category||!owner) {     
        CustomError.createError({
            name: "Error al crear el producto",
            cause: generateProductErrorInfo(product),
            message: "Error el tratar de crear el producto",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
    const createdProduct = await productModel.create({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
        owner: owner || "ADMIN"
    })
    return createdProduct
}

async function putProductById(id, newProduct) {
    const {title,description,code,price,status,stock,category,thumbnail,owner} = newProduct
    if(!title||!description||!code||!price||!status||!stock||!category||!owner) {
        CustomError.createError({
            name: "Error al crear el producto",
            cause: generateProductErrorInfo(product),
            message: "Error el tratar de crear el producto",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
    const updatedProduct = await productModel.replaceOne({_id:id}, {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
        owner: owner || "ADMIN"
    })
    return updatedProduct
}

async function deleteProductById(id) {
    const deletedProduct = await productModel.deleteOne({_id:id})
    return deletedProduct
}

// Exportamos todas las funciones
export default {
    getPaginatedProducts,
    getProductById,
    postProduct,
    putProductById,
    deleteProductById
}