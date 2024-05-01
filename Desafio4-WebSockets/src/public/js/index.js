const socket = io()
const addProductForm = document.getElementById("addProductForm")
const deleteProductForm = document.getElementById("deleteProductForm")
const productsDiv = document.getElementById("productsDiv")

// Se añaden los eventos necesarios para añadir los productos al enviar cualquiera de los formularios
// Los eventos envian los eventos pertienentes de WebSockets con los datos necesarios.
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const code = document.getElementById('code').value
    const price = document.getElementById('price').value
    const status = document.getElementById('status').value
    const stock = document.getElementById('stock').value
    const category = document.getElementById('category').value
    socket.emit("addProductBtn", {title, description, code, price, status, stock, category})
})

deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const id = document.getElementById('id').value
    socket.emit("deleteProductBtn", parseInt(id))
})

// Para actualizar la vista, se recontruye el html con ayuda d eun loot, recibiendo los datos de 'products.json'
socket.on("updateProducts", data => {
    productsDiv.innerHTML = ""
    data.forEach(product => {
        const div = document.createElement('div')
        div.id = "product" + data.id
        div.classList.add("productContainer")
        const t = document.createElement('p')
        t.innerHTML = "<strong>Title:</strong> " + product.title 
        div.appendChild(t)
        const d = document.createElement('p')
        d.innerHTML = "<strong>Description:</strong> " + product.description 
        div.appendChild(d)
        const c = document.createElement('p')
        c.innerHTML = "<strong>Code:</strong> " + product.code 
        div.appendChild(c)
        const p = document.createElement('p')
        p.innerHTML = "<strong>Price:</strong> " + product.price 
        div.appendChild(p)
        const sa = document.createElement('p')
        sa.innerHTML = "<strong>Status:</strong> " + product.status 
        div.appendChild(sa)
        const so = document.createElement('p')
        so.innerHTML = "<strong>Stock:</strong> " + product.stock
        div.appendChild(so)
        const ca = document.createElement('p')
        ca.innerHTML = "<strong>Category:</strong> " + product.category 
        div.appendChild(ca)
        const i = document.createElement('p')
        i.innerHTML = "<strong>Id: " + product.id + "</strong>"
        div.appendChild(i)
        productsDiv.appendChild(div)
    })
})