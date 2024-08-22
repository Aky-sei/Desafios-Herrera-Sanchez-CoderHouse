import messagesService from "../dao/services/message.service.js"

function configSocket(socketServer) {
    socketServer.on('connection', socket => {
        // Evento correspondiente al chat, recibiendo en nuevo mensaje, añadiendolo a la base de datos.
        // Para luego volver a enviar todos los mensajes a los usuarios y actualizar la vista.
        socket.on('newMessage', async message => {
            try {
                await messagesService.postMessage(message)
                const data = await messagesService.getAllMessages()
                socketServer.emit('updateMessages', data)
            } catch(error) {
                console.error("Error en la conexión", error)
            }
        })
    })
}

export default configSocket