// Mismo archivo del desafio anterior con ligeros ajustes basados en los comentarios del mismo.

import { promises as fs } from 'fs'

class Product {
    constructor (title, description, price, thumbnail, code, stock) {
        if(!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Por favor, llene todos los campos")
        } else {
            this.title = title,
            this.description = description,
            this.price = price,
            this.thumbnail = thumbnail,
            this.code = code,
            this.stock = stock
        }
    }
}

class ProductManager {
    constructor (path) {
        this.path = path
    }

    async getProducts() {
        try {
            let data = await fs.readFile(this.path,'utf8')
            return JSON.parse(data)
        } catch (error) {
            console.error("Error al cargar los usuarios", error)
        }
    }

    async addProduct (product) {
        try {
            let data = await this.getProducts()
            const codeExist = data.find(prod => prod.code === product.code)
            if (codeExist){
                throw new Error("El campo 'code' no puede repetirse")
            } else {
                const id = data[data.length-1]?.id+1 || 1
                const temp = {...product, id: id}
                data.push(temp)
                await fs.writeFile(this.path,JSON.stringify(data, null, 2))
            }
        } catch (error) {
            console.error("Error al añadir el producto", error)
        }
    }

    async getProducById (id) {
        try {
            let data = await this.getProducts()
            const temp = data.find(prod => prod.id === id)
            if (temp) {
                return temp
            } else {
                throw new Error("Not Found, no existe ningun producto con ese ID")
            }
        } catch (error) {
            console.error("Error al localizar el producto", error)
        }
    }
    async updateProduct (id, newProduct) {
        try {
            let data = await this.getProducts()
            let index = data.findIndex(prod => prod.id === id)
            if (index < 0) {
                throw new Error("No se encontró ningun producto con ese ID")
            } else {
                const codeExist = data.find(prod => prod.code === newProduct.code)
                if (codeExist) {
                    throw new Error("El campo 'code' no puede repetirse")
                } else {
                    const temp = {...newProduct, id: id}
                    data[index] = temp
                    await fs.writeFile(this.path,JSON.stringify(data, null, 2))
                }
            }
            } catch (error) {
            console.error("Error al actualizar el producto", error)
        }
    }

    async deleteProduct (id) {
        try {
            let data = await this.getProducts()
            let index = data.findIndex(prod => prod.id === id)
            if (index >= 0) {
                data.splice(index,1)
                await fs.writeFile(this.path,JSON.stringify(data, null, 2))
            } else {
                throw new Error("No existe ningun producto con ese ID")
            }
        } catch (error) {
            console.error("Error al eliminar el producto", error)
        }
    }
}

// Se exporta tanto ProductManager como Product preparandonos para una futura implementación de metodos "put" o "post"
export {ProductManager, Product}