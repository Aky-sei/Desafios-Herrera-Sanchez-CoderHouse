import {promises as fs} from 'fs'

// clase que maneja los carritos, separado en un archivo aparte para más facilidad en la lectura.
class CartManager {
    constructor (path) {
        this.path = path
    }

    async getCarts () {
        try {
            const data = await fs.readFile(this.path,'utf8')
            return JSON.parse(data)
        } catch (error) {
            throw new Error(error)
        }
    }

    async addCart () {
        const data = await this.getCarts()
        const temp = {
            id: data[data.length-1]?.id+1 || 1,
            products: []
        }
        data.push(temp)
        await fs.writeFile(this.path,JSON.stringify(data, null, 2))
    }

    async getCartById (id) {
        const data = await this.getCarts()
        const temp = data.find(car => car.id === id)
        if (temp) {
            return temp
        } else {
            throw new Error("Not Found, no existe ningun carrito con ese ID")
        }
    }

    async addProductToCart (cid, pid) {
        const data = await this.getCarts()
        const index = data.findIndex(car => car.id === cid)
        const cart = data[index]
        if (index) {
            const prod = cart.products.find(prod => prod.product === pid)
            if(prod) {
                prod.quantity ++
            } else {
                cart.products.push({product: pid, quantity: 1})
            }
            await fs.writeFile(this.path,JSON.stringify(data, null, 2))
        } else {
            throw new Error("Not Found, no existe ningun carrito con ese ID")
        }
    }
}

export {CartManager}