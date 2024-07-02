const addProductForm = document.getElementById("addProductForm")
const deleteProductForm = document.getElementById("deleteProductForm")

addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        await fetch('http://localhost:8080/api/products', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: addProductForm[0].value,
                description: addProductForm[1].value,
                code: addProductForm[2].value,
                price: addProductForm[3].value,
                status: addProductForm[4].value,
                stock: addProductForm[5].value,
                category: addProductForm[6].value
            })
        })
    } catch (error) {
        console.error("Error al añadir el producto a la base de datos", error)
    }
})

deleteProductForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
        await fetch(`http://localhost:8080/api/products/${deleteProductForm[0].value}`, {
            method: "DELETE",
            headers: {'Content-Type': 'application/json'}
        })
    } catch (error) {
        console.error("Error al elimnar el producto", error)
    }
})