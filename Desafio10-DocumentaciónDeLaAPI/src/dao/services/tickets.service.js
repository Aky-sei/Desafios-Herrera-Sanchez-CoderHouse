import CustomError from "../errors/CustomError.js"
import EErrors from "../errors/enums.js"
import { generateTicketErrorInfo } from "../errors/info.js"
import ticketsModel from "../models/tickets.model.js"

async function postTicket(ticket) {
    const { code,purchase_datetime,amount,purchaser} = ticket
    if (!code || !purchase_datetime || !amount || !purchaser) {
        CustomError.createError({
            name: "Error de creación de ticket",
            cause: generateTicketErrorInfo(ticket),
            message: "Error tratando de crear el ticket",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
    const newTicket = await ticketsModel.create({
        code,
        purchase_datetime,
        amount,
        purchaser
    })
    return newTicket
}

export default {
    postTicket
}