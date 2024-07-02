import CustomRouter from './router.js'
import cartsController from '../controllers/carts.controller.js'

// Definimos las rutas para manejar los carritos
export default class CartsRouter extends CustomRouter{
    init() {
        this.get("/",["ADMIN"], cartsController.getAllCarts)
        
        this.post("/",["USER", "ADMIN"], cartsController.postEmptyCart)
        
        this.get("/:cid",["USER", "ADMIN"], cartsController.getCartByParamsId)
        
        this.post("/:cid/products/:pid",["USER", "ADMIN"], cartsController.postProductToCartByParamsId)
        
        this.put("/:cid",["ADMIN"], cartsController.putCartByParamsId)
        
        this.delete("/:cid",["USER", "ADMIN"], cartsController.deleteCartByParamsId)
        
        this.delete("/:cid/products/:pid",["USER", "ADMIN"], cartsController.deleteProductFromCartByParamsId)
        
        this.put("/:cid/products/:pid",["USER", "ADMIN"], cartsController.putProductFromCartByParamsId)
    }
}