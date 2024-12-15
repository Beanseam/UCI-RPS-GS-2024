import { io } from "socket.io-client";//Gets an individual socket for connection

const socket = io('http://localhost:3000')

socket.on('connect', () => {//On connection to server run what is in the function
    displayMessage(`You connectd with id: ${socket.id}`)
})

socket.emit('custom-event', 10, 'Hello', {a: "a"})//This sends information to server with function 'custom-event'