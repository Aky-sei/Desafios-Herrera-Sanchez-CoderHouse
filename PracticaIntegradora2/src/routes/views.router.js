import { productModel } from '../dao/models/product.model.js'
import { messageModel } from '../dao/models/message.model.js'
import { cartModel } from '../dao/models/cart.model.js'
import CustomRouter from './router.js'

export default class viewsiewsRouter extends CustomRouter{
    init() {
        this.get('/',["PUBLIC"], async (req, res) => {
            if(req.session.user) {
                res.render('home', {
                    isLoged: true
                })
            } else {
                res.render('home', {
                    isLoged: false
                })
            }
        })
        
        this.get('/realtimeproducts',["ADMIN"], async (req, res) => {
            res.render('realTimeProducts', {
                products: await productModel.find().lean()
            })
        })
        
        // La logica correspondiente a la ruta '/chat' se deja el 'views' al ser muy simple y no tener una api.
        this.get('/chat',["PUBLIC"], isLoged, async (req,res) => {
            res.render('chat', {
                messages: await messageModel.find().lean(),
                user: req.session.user.name
            })
        })
        
        this.get('/products',["PUBLIC"], isLoged, async (req,res) => {
            let { limit = 6, page = 1, sort, query = "0"} = req.query
            const products = await productModel.paginate(JSON.parse(query), {
                limit: limit,
                page: page,
                sort: sort == "asc" ? 'price code' : sort == "desc" ? '-price code' : {},
                lean: true
            })
            res.render('products',["PUBLIC"], {
                user: req.session.user,
                products: products.docs,
                pageData: products,
                prevLink: page > 1 ? `/products?limit=${limit}&page=${page>products.totalPages+1 ? parseInt(products.totalPages) : parseInt(page) - 1}&sort=${sort || ''}&query=${query}` : null,
                nextLink: page < products.totalPages ? `/products?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort || ''}&query=${query}` : null
            })
        })
        
        this.get('/cart',["PUBLIC"], isLoged, async (req,res) => {
            res.redirect(`/cart/${req.session.user.cart._id}`)
        })
        
        this.get('/cart/:cid',["PUBLIC"], isLoged, async (req,res) => {
            const cart = await cartModel.findOne({_id: req.params.cid}).populate('products.product').lean()
            res.render('cart', {
                products: cart.products,
                cartID: req.params.cid
            })
        })
        
        this.get('/login',["PUBLIC"], isNotLoged, async (req,res) => {
            res.render('login')
        })
        
        this.get('/register',["PUBLIC"], isNotLoged, async (req,res) => {
            res.render('register')
        })
        
        this.get('/profile',["USER"], isLoged, async (req,res) => {
            res.render('profile', {
                user: req.session.user
            })
        })  
    }
}

function isLoged(req,res,next) {
    if (req.session.user) {
        return next()
    } else {
        res.redirect('/login')
    }
}
function isNotLoged(req,res,next) {
    if (!req.session.user) {
        return next()
    } else {
        res.redirect('/profile')
    }
}