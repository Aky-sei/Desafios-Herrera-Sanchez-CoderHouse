export const generatedUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of requiered properties:
    * fullName: needs to be a String, received ${user.first_name}
    * email: needs to be a String, received ${user.email}
    * age: needs to be a Number, received ${user.age || ""}
    * password: needs to be a String, received ${user.password || ""}
    * role: needs to be a String, either USER or ADMIN, received ${user.role}
    * authMethod: needs to be a String, received ${user.authMethod || ""}
    * cart: needs to be a String, received ${user.cart}`
}

export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of requiered properties:
    * title: needs to be a String, received ${product.title}
    * description: needs to be a String, received ${product.description}
    * code: needs to be a String, received ${product.code}
    * price: needs to be a Number, received ${product.price}
    * status: needs to be a Boolean, received ${product.status}
    * stock: needs to be a Number, received ${product.stock}
    * category: needs to be a String, received ${product.category}
    * thumbnail: needs to be a Array, received ${JSON.stringify(product.thumbnail)}`
}

export const generateTicketErrorInfo = (ticket) => {
    return `One or more properties were incomplete or not valid.
    List of requiered properties:
    * code: needs to be a String, received ${ticket.code}
    * purchase_datetime: needs to be a Date, received ${ticket.purchase_datetime}
    * amount: needs to be a Number, received ${ticket.amount}
    * purchaser: needs to be a String, received ${ticket.purchaser}`
}