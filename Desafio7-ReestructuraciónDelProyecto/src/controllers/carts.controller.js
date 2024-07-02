import cartsService from '../services/carts.service.js'

// Definimos las funciones para el controllador de los carritos
async function getAllCarts(req,res) {
    try {
        const carts = await cartsService.getAllCarts()
        res.sendSuccess(carts)
    } catch (error) {
        res.sendServerError("Error al obtener los carritos", error)
    }
}

async function postEmptyCart(req,res) {
    try {
        const cart = await cartsService.postCart()
        res.sendSuccess(cart)
    } catch (error) {
        res.sendServerError("Error al crear el carrito", error)
    }
}

async function getCartByParamsId(req,res) {
    try {
        const cart = await cartsService.getPopulatedCartById(req.params.cid)
        if (cart) {
            res.sendSuccess(cart)
        } else {
            res.sendUserError("El carrito no existe")
        }
    } catch (error) {
        res.sendServerError("Error al obtener el carrito", error)
    }
}

async function postProductToCartByParamsId(req,res) {
    try {
        const {products} = await cartsService.getCartById(req.params.cid)
        const found = products.find(prod => prod.product._id == req.params.pid)
        if (found) {
            res.sendUserError("El producto ya existe en ese carrito")
        } else {
            products.push({
                product:req.params.pid,
                quantity: 1
            })
            await cartsService.putCartById(req.params.cid, {products})
            res.sendSuccess(products)
        }
    } catch (error) {
        res.sendServerError("Error al añadir el producto al carrito", error)
    }
}

async function putCartByParamsId(req,res) {
    try {
        const newCart = await cartsService.putCartById(req.params.cid, {products:req.body})
        res.sendSuccess(newCart)
    } catch (error) {
        res.sendServerError("Error al actualizar los productos del carrito", error)
    }
}

async function deleteCartByParamsId(req,res) {
    try {
        const update = await cartsService.emptyCartById(req.params.cid)
        res.sendSuccess(update)
    } catch (error) {
        res.sendServerError("Error al eliminar los productos del carrito", error)
    }
}

async function deleteProductFromCartByParamsId(req,res) {
    try {
        const {products} = await cartsService.getCartById(req.params.cid)
        const i = products.findIndex(prod => prod.product == req.params.pid)
        products.splice(i,1)
        await cartsService.putCartById(req.params.cid, {products})
        res.sendSuccess(products)
    } catch (error) {
        res.sendServerError("Error al eliminar un producto del carrito", error)
    }
}

async function putProductFromCartByParamsId(req,res) {
    try {
        const {products} = await cartsService.getCartById(req.params.cid)
        const i = products.findIndex(prod => prod.product == req.params.pid)
        if(i < 0) {
            res.sendUserError("Ese producto no esta en ese carrito")
        } else {
            products[i].quantity = req.body.quantity
            await cartsService.putCartById(req.params.cid, {products})
            res.sendSuccess(products)
        }
    } catch (error) {
        res.sendServerError("Error al actualizar la cantidad del producto", error)
    }
}

// Exportamos las funciones
export default {
    getAllCarts,
    postEmptyCart,
    getCartByParamsId,
    postProductToCartByParamsId,
    putCartByParamsId,
    deleteCartByParamsId,
    deleteProductFromCartByParamsId,
    putProductFromCartByParamsId
}