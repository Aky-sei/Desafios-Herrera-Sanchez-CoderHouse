import productModel from "../persistence/models/products.model.js"

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
    return await productModel.findById(id)
}

async function postProduct(product) {
    const {title,description,code,price,status,stock,category,thumbnail} = product
    if(!title||!description||!code||!price||!status||!stock||!category) {
        throw new Error("Por favor, llene todos los campos")
    }
    const createdProduct = await productModel.create({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
    })
    return createdProduct
}

async function putProductById(id, newProduct) {
    const {title,description,code,price,status,stock,category,thumbnail} = newProduct
    if(!title||!description||!code||!price||!status||!stock||!category) {
        throw new Error("Por favor, llene todos los campos")
    }
    const updatedProduct = await productModel.replaceOne({_id:id}, {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
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