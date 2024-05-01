const socket = io()
const addProductForm = document.getElementById("addProductForm")
const deleteProductForm = document.getElementById("deleteProductForm")
const productsDiv = document.getElementById("productsDiv")

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

socket.on("addProduct", data => {
    const div = document.createElement('div')
    div.id = "product" + data.id
    div.classList.add("productContainer")
    const dat = data.product
    const t = document.createElement('p')
    t.innerHTML = "<strong>Title:</strong> " + dat.title 
    div.appendChild(t)
    const d = document.createElement('p')
    d.innerHTML = "<strong>Description:</strong> " + dat.description 
    div.appendChild(d)
    const c = document.createElement('p')
    c.innerHTML = "<strong>Code:</strong> " + dat.code 
    div.appendChild(c)
    const p = document.createElement('p')
    p.innerHTML = "<strong>Price:</strong> " + dat.price 
    div.appendChild(p)
    const sa = document.createElement('p')
    sa.innerHTML = "<strong>Status:</strong> " + dat.status 
    div.appendChild(sa)
    const so = document.createElement('p')
    so.innerHTML = "<strong>Stock:</strong> " + dat.stock
    div.appendChild(so)
    const ca = document.createElement('p')
    ca.innerHTML = "<strong>Category:</strong> " + dat.category 
    div.appendChild(ca)
    const i = document.createElement('p')
    i.innerHTML = "<strong>Id: " + data.id + "</strong>"
    div.appendChild(i)
    productsDiv.appendChild(div)
})

socket.on("deleteProduct", id => {
    const del = "product" + id
    const div = document.getElementById(del)
    div.remove()
})