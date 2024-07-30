import viewsController from '../controllers/views.controller.js'
import CustomRouter from './router.js'

export default class ViewsRouter extends CustomRouter{
    init() {
        this.get('/',["PUBLIC"], viewsController.renderHome) 
        
        this.get('/chat',["USER", "ADMIN"], viewsController.renderChat)
        
        this.get('/products',["PUBLIC"], viewsController.renderProducts)
        
        this.get('/cart',["USER", "ADMIN"], viewsController.redirectToCart)
        
        this.get('/cart/:cid',["USER", "ADMIN"], viewsController.renderCartFromParamsId)
        
        this.get('/login',["PUBLIC"], viewsController.renderLogin)
        
        this.get('/register',["PUBLIC"], viewsController.renderRegister)
        
        this.get('/profile',["USER", "ADMIN"], viewsController.renderProfile)  
    }
}