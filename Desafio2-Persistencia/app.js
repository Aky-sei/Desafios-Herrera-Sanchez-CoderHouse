const fs = require('fs').promises

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
            console.log("Error al cargar los usuarios", error)
            return []
        }
    }

    async addProduct (product) {
        try {
            let data = await this.getProducts()
            const codeExist = data.find(prod => prod.code === product.code)
            if (codeExist){
                throw new Error("El campo 'code' no puede repetirse")
            } else {
                const temp = {...product, id: data.length+1}
                data.push(temp)
                await fs.writeFile(this.path,JSON.stringify(data, null, 2))
                console.log("Producto añadido correctamente")
            }
        } catch (error) {
            console.log("Error al añadir el producto", error)
        }
    }

    async getProducById (id) {
        try {
            let data = await this.getProducts()
            const temp = await data.find(prod => prod.id === id)
            if (temp) {
                return temp
            } else {
                throw new Error("Not Found, no existe ningun producto con ese ID")
            }
        } catch (error) {
            console.log("Error al localizar el producto", error)
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
                    data.splice(index,1)
                    const temp = {...newProduct, id: id}
                    data.push(temp)
                    await fs.writeFile(this.path,JSON.stringify(data, null, 2))
                    console.log("Producto actualizado correctamente")
                }
            }
            } catch (error) {
            console.log("Error al actualizar el producto", error)
        }
    }

    async deleteProduct (id) {
        try {
            let data = await this.getProducts()
            let index = data.findIndex(prod => prod.id === id)
            if(index >= 0) {
                data.splice(index,1)
                await fs.writeFile(this.path,JSON.stringify(data, null, 2))
                console.log("Producto eliminado correctamente")
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error)
        }
    }
}

const productManager = new ProductManager('./data.json')
const product1 = new Product ("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc111", 25)
const product2 = new Product ("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc222", 25)
const product3 = new Product ("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc333", 25)
const product4 = new Product ("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc444", 25)
const product5 = new Product ("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc555", 25)

async function a () {
    const data =  await productManager.getProducts()
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].id, data[i].code)
    }
    // await productManager.addProduct(product1)
    // await productManager.addProduct(product2)
    // await productManager.addProduct(product3)
    await productManager.updateProduct(2,product4)
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].id, data[i].code)
    }
}
a()