import { productModel } from '../dao/models/product.model.js'
import CustomRouter from './router.js'

export default class ProductsRouter extends CustomRouter {
    init () {
        this.get("/",["PUBLIC"], async (req, res)=> {
            try {
                let { limit = 10, page = 1, sort, query = 0} = req.query
                const products = await productModel.paginate((JSON.parse(query)), {
                    limit: limit,
                    page: page,
                    sort: sort == "asc" ? 'price code' : sort == "desc" ? '-price code' : {}
                })
                query = encodeURIComponent(query).toString()
                res.json({status:"success",payload:{
                    ...products,
                    prevLink: page > 1 ? `/products?limit=${limit}&page=${parseInt(page) - 1}&sort=${sort || ''}&query=${query}` : null,
                    nextLink: page < products.totalPages ? `/products?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort || ''}&query=${query}` : null 
                }})
            } catch (error) {
                console.error("Error al obtener los productos", error)
                res.status(500).send({status:"error", error:"Error al obtener los productos"})
            }
        })
        
        this.get('/:pid',["PUBLIC"], async (req, res) => {
            try {
                const product = await productModel.findById(req.params.pid)
                res.json({status:"success", payload:product})
            } catch (error) {
                console.error("Error al obtener el producto", error)
                res.status(500).send({status:"error", error:"Error al obtener el producto"})
            }
        })
        
        this.post('/',["PUBLIC"], async (req,res) => {
            try {
                const {title,description,code,price,status,stock,category,thumbnail} = req.body
                const product = await productModel.create({
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnail
                })
                res.json({status:"success", payload:product}) 
            } catch (error) {
                console.error("Error al agregar el producto", error)
                res.status(500).send({status:"error", error:"Error al agregar el producto"})
            }
        })
        
        this.put('/:pid',["PUBLIC"], async (req,res) => {
            try {
                const {title,description,code,price,status,stock,category,thumbnail} = req.body
                if(!title||!description||!code||!price||!status||!stock||!category) {
                    throw new Error("Por favor, llene todos los campos")
                }
                const newProduct = await productModel.replaceOne({_id:req.params.pid}, {
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnail
                })
                res.json({status:"success", payload:newProduct}) 
            } catch (error) {
                console.error("Error al actualizar el prodcuto", error)
                res.status(500).send({status:"error", error:"Error al actualizar el producto"})
            }
        })
        
        this.delete('/:pid',["PUBLIC"], async (req,res) => {
            try {
                const delProduct = await productModel.deleteOne({_id:req.params.pid})
                res.json({status:"success", payload:delProduct}) 
            } catch (error) {
                console.error("Error al eliminar el prodcuto", error)
                res.status(500).send({status:"error", error:"Error al eliminar el producto"})
            }
        })
    }
}