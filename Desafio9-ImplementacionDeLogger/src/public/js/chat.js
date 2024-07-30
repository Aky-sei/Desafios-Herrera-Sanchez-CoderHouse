const socket = io()
const chatForm = document.getElementById("chatForm")
const chatInput = document.getElementById("chatInput")
const messagesContainer = document.getElementById("messagesContainer")
const user = document.getElementById("userName").value

chatForm.addEventListener("submit", sendMessage)
chatForm.addEventListener("keyup", sendMessage)

// Se separa la función de enviar el mensaje para poder usarlo en ambos trigger arriba.
function sendMessage (e) {
    e.preventDefault()
    if (e.key==="Enter" || e.key===undefined) {
        if (chatInput.value.trim().length>0) {
            socket.emit('newMessage', {user:user, message:chatInput.value})
            chatInput.value = ""
        }
    }
}

socket.on('updateMessages', data => {
    messagesContainer.innerHTML = ""
    data.forEach(message => {
        const p = document.createElement('p')
        p.innerHTML = '<strong>' + message.user + " dice: </strong>" + message.message
        messagesContainer.appendChild(p)
    })
})