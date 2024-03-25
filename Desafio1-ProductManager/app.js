class ProductManager {
    constructor() {
        this.products = []
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        const existeCodigo = this.products.find(prod => prod.code == code)

        if(!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Por favor llene todos los campos")
        } else if (existeCodigo) {
            console.log("El campo 'code' no puede repetirse")
        } else {
            this.products.push({
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                id: this.products.length + 1
            })
            console.log("El producto ha sido añadido")
        }
    }

    getProducts() {
        return this.products
    }

    getProductByID(id) {
        const existeID = this.products.find(prod => prod.id == id)
        if(existeID) {
            return existeID
        } else {
            throw new Error("Not Found, no existe ningun producto con ese ID")
        }
    }
}

//----- Campos comentados para facilitar la revisión -----

// const productManager = new ProductManager

// console.log(productManager.getProducts())

// productManager.addProduct("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25)

// console.log(productManager.getProducts())

// productManager.addProduct("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25)

// console.log(productManager.getProductByID(1))
// console.log(productManager.getProductByID(2))