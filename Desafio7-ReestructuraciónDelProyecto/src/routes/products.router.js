import CustomRouter from "./router.js"
import productsController from "../controllers/products.controller.js"

// Inicializamos en router de los productos
export default class ProductsRouter extends CustomRouter {
    init() {
        this.get("/",["PUBLIC"], productsController.getAllProducts)
        
        this.get('/:pid',["PUBLIC"], productsController.getProductByParamsId)
        
        this.post('/',["ADMIN"], productsController.postProduct)
        
        this.put('/:pid',["ADMIN"], productsController.putProductByParamsId)
        
        this.delete('/:pid',["ADMIN"], productsController.deleteProductByParamsId)
    }
}