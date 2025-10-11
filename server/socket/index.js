import {Server} from "socket.io";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {User} = require("../models/index.cjs");

let io;

let userSocketMap = {};

export const getUserSocketId = (userId)=>{
    return userSocketMap[userId];
}

const initializeSocket = (server)=>{
    io = new Server(server,{
        cors : {
            origin : ["http://localhost:5173"],
            credentials:true,
        },
    });

    io.on("connection",(socket)=>{
    console.log(" A user connected(backend): ", socket.id);

    const userId = socket.handshake.query.userId;
    console.log("User id in socket(backend): ",userId);
    if(userId){
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        console.log("A user disconnected(backend): ",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})
}

export const getIoInstance = ()=>{
    return io;
}



export {initializeSocket}
