import { promises as fs } from 'fs'

//Clase que maneja los productos, separado en un archivo aparte para más facilidad en la lectura.
class ProductManager {
    constructor (path) {
        this.path = path
    }

    async getProducts() {
        try {
            let data = await fs.readFile(this.path,'utf8')
            return JSON.parse(data)
        } catch (error) {
            throw new Error(error)
        }
    }

    async addProduct ({title, description, code, price, status, stock, category, thumbnail}) {
        try {
            if(!title || !description || !price || !code || !stock || !status || !category) {
                throw new Error("Por favor, llene todos los campos")
            } else {
                let data = await this.getProducts()
                const codeExist = data.find(prod => prod.code === code)
                if (codeExist){
                    throw new Error("El campo 'code' no puede repetirse")
                } else {
                    const product = {
                        title: title,
                        description: description,
                        code: code,
                        price: price,
                        status: status,
                        stock: stock,
                        category: category,
                        thumbnail: thumbnail || []
                    }
                    const id = data[data.length-1]?.id+1 || 1
                    const temp = {...product, id: id}
                    data.push(temp)
                    await fs.writeFile(this.path,JSON.stringify(data, null, 2))
                }
            }
        } catch (error) {
            throw new Error(error)
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
            throw new Error(error)
        }
    }
    async updateProduct (id, {title, description, code, price, status, stock, category, thumbnail}) {
        try {
            let data = await this.getProducts()
            let index = data.findIndex(prod => prod.id === id)
            if (index < 0) {
                throw new Error("No se encontró ningun producto con ese ID")
            } else {
                const codeExist = data.find(prod => prod.code === code && prod.id !== id)
                if (codeExist) {
                    throw new Error("El campo 'code' no puede repetirse")
                } else {
                    const temp = {
                        // El objeto "temp" es construido con los parametros dados, los parametros faltanes con
                        // reemplazados por los datos del objeto a actualizar.
                        title: title || data[index].title,
                        description: description || data[index].description,
                        code: code || data[index].code,
                        price: price || data[index].price,
                        status: status || data[index].status,
                        stock: stock || data[index].stock,
                        category: category || data[index].category,
                        thumbnail: thumbnail || data[index].thumbnail || [],
                        // El id siempre es igual al del objeto a actualizar.
                        id: id
                    }
                    data[index] = temp
                    await fs.writeFile(this.path,JSON.stringify(data, null, 2))
                }
            }
            } catch (error) {
            throw new Error(error)
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
            throw new Error(error)
        }
    }
}

export {ProductManager}