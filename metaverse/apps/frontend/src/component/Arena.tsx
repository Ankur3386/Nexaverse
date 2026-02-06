import React, { useState } from 'react'
import { websocketHook } from '../hooks/websocket'

const Arena = () => {
    const [users,setUsers] = useState(new Map());
    const [currentUser,setCurrentUser]=useState({})
    const url = new URLSearchParams(window.location.search)
    const token =url.get('token')
    const spaceId=url.get('spaceId')
    
    const handleMove=(message:any)=>{
    switch(message.type){
    case 'space-joined':
     setCurrentUser(
        {
            x:message.payload.spawn.x,
            y:message.payload.spawn.y,
            userId:message.payload.userId
        }
     )
     const newUsers= new Map();
     message.users.forEach((user:any)=>{
       newUsers.set(user.userId,user)
     })
     setUsers(newUsers)
     break;

     case 'user-join':
       setUsers((prev)=>{
        const newUsers=new Map(prev);
       newUsers.set(message.payload.userId,{
        x:message.payload.x,
        y:message.payload.y,
        userId:message.payload.userId,
       })
       return newUsers
       })
     break ;
     case 'movement':
         setUsers((prev)=>{
        const newUsers=new Map(prev);
      const user= newUsers.get(message.payload.userId)
      if(user!=undefined){
        user.x= message.payload.x
        user.y= message.payload.y
      }
       return newUsers
       })
       break;
       case 'movement-rejected':
        setCurrentUser((prev)=>({
        ...prev,
        x:message.payload.x,
        y:message.payload.y
    }))
    break;
     case'user-left':
      setUsers((prev)=>{
        const newUsers = new Map(prev)
        newUsers.delete(message.payload.userId)
         return newUsers
      })
      break;
    }}
    const {send}= websocketHook(spaceId,token,handleMove)

    //Canvas logic-->
    
  return (
    <div>Arena</div>
  )
}

export default Arena