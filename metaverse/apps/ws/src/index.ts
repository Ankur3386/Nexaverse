import {WebSocketServer} from "ws"
import { User } from "./User";
import { WebSocket } from "ws";
import dotenv from "dotenv"
dotenv.config()
const wss= new WebSocketServer({port:8080});
wss.on('connection',(socket:WebSocket)=>{
  const user= new User(socket);
  socket.on("error",(error)=>{
    console.log("socket error",error)
  })
  socket.on('close',()=>{
    user?.destroy()
  })
  
})