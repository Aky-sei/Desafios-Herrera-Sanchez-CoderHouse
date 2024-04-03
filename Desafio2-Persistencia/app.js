const fs = require('fs').promises

// Se crea una clase Products para poder manejar más facilmente los objetos cde los productos.
class Product {
    constructor (title, description, price, thumbnail, code, stock) {
        // Se añade dentro del mismo la comprobación de que todos los campos sean llenados.
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

// Se crea la clase ProductManager.
class ProductManager {
    // EL constructor ya no incluye el arreglo "products", pues ahora los datos se alacenan en otro archivo.
    constructor (path) {
        this.path = path
    }

    // getProducts regresa los productos encontrados en el archivo indicado en el "path".
    async getProducts() {
        try {
            let data = await fs.readFile(this.path,'utf8')
            return JSON.parse(data)
        } catch (error) {
            console.log("Error al cargar los usuarios", error)
            // De no encontrar el archivo, o ser un archivo invalido, se regresa un arreglo vacio, mostranod igualmente el error.
            return []
        }
    }

    //addProducts añade un nuevo producto al archivo y lo almacena.
    async addProduct (product) {
        try {
            // Se usa getProducts para obtener los datos.
            let data = await this.getProducts()
            // Se realiza la comprobación de que el codigo del nuevo producto no se repita con alguna existente.
            const codeExist = data.find(prod => prod.code === product.code)
            if (codeExist){
                throw new Error("El campo 'code' no puede repetirse")
            } else {
                // Se le asigna al nuevo producto un Id autoincrementable.
                // Se usa el id del ultimo elemento para asegurar que no se repitan en caso de eliminar y mover otros productos.
                const id = data[data.length-1]?.id+1 || 1
                // Se construye un objeto temporal con las propiedades del producto dado y el Id.
                const temp = {...product, id: id}
                data.push(temp)
                // Tras agragar el nuevo producto al arreglo, se sobreescribe el archivo con el nuevo arreglo.
                await fs.writeFile(this.path,JSON.stringify(data, null, 2))
                console.log("Producto añadido correctamente")
            }
        } catch (error) {
            console.log("Error al añadir el producto", error)
        }
    }

    // getProductsById regresa el producto con el Id dado.
    async getProducById (id) {
        try {
            let data = await this.getProducts()
            // Se busca el producto dado.
            const temp = await data.find(prod => prod.id === id)
            if (temp) {
                // Si se encontró el producto, se regresa el mismo.
                return temp
            } else {
                // Se manda un error si no se encuentre ningun producto con el Id dado.
                throw new Error("Not Found, no existe ningun producto con ese ID")
            }
        } catch (error) {
            console.log("Error al localizar el producto", error)
        }
    }
     // updateProducts toma un Id y reemplaza el producto con ese Id con un nuevo producto dado.
    async updateProduct (id, newProduct) {
        try {
            let data = await this.getProducts()
            // Se busca el indice del producto dado, servira para revisarlo y eliminarlo despues.
            let index = data.findIndex(prod => prod.id === id)
            if (index < 0) {
                // Se arroja un error si no se encuentra ningun producto eon ese Id.
                throw new Error("No se encontró ningun producto con ese ID")
            } else {
                // Se realiza la verificación de que el campo 'code' del nuevo producto no se repita antes de actualizar el producto
                const codeExist = data.find(prod => prod.code === newProduct.code)
                if (codeExist) {
                    throw new Error("El campo 'code' no puede repetirse")
                } else {
                    // Se elimina el producto anterior sirviendonos del indice hallado anteriormente.
                    data.splice(index,1)
                    // Se crea un objeto temporal, esta vez conservando el id del objeto anterior.
                    const temp = {...newProduct, id: id}
                    data.push(temp)
                    // Se sebreescribe el archivo con el nuevo arreglo tras agregar el nuevo producto.
                    await fs.writeFile(this.path,JSON.stringify(data, null, 2))
                    console.log("Producto actualizado correctamente")
                }
            }
            } catch (error) {
            console.log("Error al actualizar el producto", error)
        }
    }

    // deleteProducts toma un Id y elimina el producto con ese Id, si existe.
    async deleteProduct (id) {
        try {
            let data = await this.getProducts()
            // Nuevamente nos servimos del indice del objeto dado.
            let index = data.findIndex(prod => prod.id === id)
            if (index >= 0) {
                data.splice(index,1)
                // Se elimina el producto y se sobreescribe el archivo.
                await fs.writeFile(this.path,JSON.stringify(data, null, 2))
                console.log("Producto eliminado correctamente")
            } else {
                throw new Error("No existe ningun producto con ese ID")
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error)
        }
    }
}


// Se dejan creadas varias instancias del Product y una instancia de ProductManager para facilitar la revisión.
// El 'code' de cada Product es distinto para evitar problemas.
const productManager = new ProductManager('./data.json')
const product1 = new Product ("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc111", 25)
const product2 = new Product ("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc222", 25)
const product3 = new Product ("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc333", 25)
const product4 = new Product ("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc444", 25)
const product5 = new Product ("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc555", 25)

// Dado que las mayoria de metodos son asincrinos, se deja un dunción para poder ejecitarlas de maneja sincrona.
async function a () {
    // Antes y despues del codigo a ejecutar, se muestra los campos 'code' e 'id'
    // de los objetos que ya se encuentran alacenados para facilitar la visualización de los cambios.
    let data =  await productManager.getProducts()
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].id, data[i].code)
    }

    // Se deja comtada una instancia de cada metodo relevante para facilitar la revisión.
// -----------------------------------
    // await productManager.addProduct(product2)
    // await productManager.updateProduct(2,product4)
    // await productManager.deleteProduct(4)
    // console.log(data)
// ------------------------------------

    data = await productManager.getProducts()
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].id, data[i].code)
    }
}
a()