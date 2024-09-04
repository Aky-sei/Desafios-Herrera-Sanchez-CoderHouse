import CustomRouter from './router.js'
import cartsController from '../controllers/carts.controller.js'

// Definimos las rutas para manejar los carritos
export default class CartsRouter extends CustomRouter{
    init() {
        this.get("/",["ADMIN"], cartsController.getAllCarts)
        
        this.get("/:cid",["USER", "ADMIN", "PREMIUM"], cartsController.getCartByParamsId)
        
        this.post("/:cid/products/:pid",["USER", "ADMIN", "PREMIUM"], cartsController.postProductToCartByParamsId)
        
        this.put("/:cid",["ADMIN"], cartsController.putCartByParamsId)
        
        this.delete("/:cid",["USER", "ADMIN", "PREMIUM"], cartsController.deleteCartByParamsId)
        
        this.delete("/:cid/products/:pid",["USER", "ADMIN", "PREMIUM"], cartsController.deleteProductFromCartByParamsId)
        
        this.put("/:cid/products/:pid",["USER", "ADMIN", "PREMIUM"], cartsController.putProductFromCartByParamsId)

        this.get("/:cid/purchase",["USER", "ADMIN", "PREMIUM"], cartsController.purchaseCartByParamsId)
    }
}