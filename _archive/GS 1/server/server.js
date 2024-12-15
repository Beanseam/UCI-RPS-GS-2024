const io = require("socket.io")(3000, {
    cors: {//Handles CORS error
        origin: ["https://localhost:8080"],
    }
})//Passing in port of server, in this case 3000

io.on('connection', socket => {
    console.log(socket.id)
    socket.on('custom-event', (number, string, obj) => {//when client emits custom-event, this function is called
        io.emit('recieve-message')//sends function call to client
        console.log(number, string, obj)
    })
})//function that runs every time a client connects to server
//Video for more information: https://www.youtube.com/watch?v=ZKEqqIO7n-k