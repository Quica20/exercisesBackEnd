//CLIENTE
const socket = io()
let user;

const chatbox = document.getElementById("chatbox");
const messageLogs = document.getElementById("messageLogs");

Swal.fire({
    title: 'identificate',
    input: 'text',
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre de USUARIO'
    },
    allowOutsideClick: false,
}).then(result => {
    user = result.value;
    socket.emit('authenticatedUser', user)
})

chatbox.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
        socket.emit("message", { user: user, mensaje: chatbox.value });
        chatbox.value = "";
    };
});

socket.on("imprimir", (data) => {
    let mensajes = '';
    data.forEach(msj => {
        mensajes += `${msj.user} Escribio: ${msj.mensaje} <br/>`
    });
    messageLogs.innerHTML = mensajes
});


socket.on('newUserAlert', (data) => {
    if (!user) return
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        title: data + 'Se ha unido al chat',
        icon: 'success'
    })
});