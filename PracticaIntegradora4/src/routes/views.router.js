import viewsController from '../controllers/views.controller.js'
import CustomRouter from './router.js'

export default class ViewsRouter extends CustomRouter{
    init() {
        this.get('/',["PUBLIC"], viewsController.renderHome) 
        
        this.get('/chat',["USER", "ADMIN", "PREMIUM"], viewsController.renderChat)
        
        this.get('/products',["PUBLIC"], viewsController.renderProducts)
        
        this.get('/cart',["USER", "ADMIN", "PREMIUM"], viewsController.redirectToCart)
        
        this.get('/cart/:cid',["USER", "ADMIN", "PREMIUM"], viewsController.renderCartFromParamsId)
        
        this.get('/login',["PUBLIC"], viewsController.renderLogin)
        
        this.get('/register',["PUBLIC"], viewsController.renderRegister)
        
        this.get('/profile',["USER", "ADMIN", "PREMIUM"], viewsController.renderProfile)  

        this.get('/forgotpassword',["PUBLIC"], viewsController.renderForgotpassword)

        this.get('/updatepassword/:token',["PUBLIC"], viewsController.renderUpdatePassword)        

        this.get('/upload',["USER", "PREMIUM", "ADMIN"], viewsController.renderUpload)
    }
}