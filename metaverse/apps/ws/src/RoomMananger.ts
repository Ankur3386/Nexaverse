import { User } from "./User"

export class RoomManager{
     rooms:Map<string,User[]>=new Map()
    static instance:RoomManager
    constructor(){
     this.rooms=new Map()
    }

  static  getInstance(){
        if(!this.instance){
         return this.instance=new RoomManager()
        }
        return this.instance
    }
//     getInstance(){
//         if(!RoomManger.instance){
//          return RoomManger.instance=new RoomManager()
//         }
//         return RoomManger.instance
//     }
 addUser(spaceId:string,user:User){
    if(!this.rooms.has(spaceId)){
         this.rooms.set(spaceId,[user])
            return;
    }
    this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]);
 
 }
 //id used here as userId can be un defined
removeUser(spaceId:string,user:User){
    if(this.rooms.has(spaceId)){
   this.rooms.set(spaceId,(this.rooms.get(spaceId)?.filter(x=>x.id!==user.id) ?? []))  
    } 
}
broadCast(spaceId:string,user:User,message:any){
const users=this.rooms.get(spaceId)?.filter(x=>x.id!==user.id)
users?.map(x=>x.send(message))
}

}