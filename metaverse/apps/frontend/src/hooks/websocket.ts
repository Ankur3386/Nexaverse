import { useEffect, useRef } from "react"
export const websocketHook = (spaceId:any,token:any,handleMove:(message:any)=>void) => {

const wsRef=useRef<WebSocket|null>(null);
useEffect(()=>{
const ws= new WebSocket("ws://localhost:8080");
wsRef.current=ws
ws.onopen=()=>{
ws.send(JSON.stringify({
      "type": "join",
    "payload": {
	    "spaceId": spaceId,
	    "token": token
    }
})
)
}
ws.onmessage=(event)=>{
    const message=JSON.parse(event.data)
   handleMove(message)
}
return()=>{
    wsRef.current?.close()
}
},[spaceId,token])
const send=(data:any)=>{
    if(wsRef.current?.readyState== WebSocket.OPEN)
 wsRef.current?.send(JSON.stringify(data))
}
return(
    {send}
)
}
