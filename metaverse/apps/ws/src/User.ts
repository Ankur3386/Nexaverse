import jwt, { JwtPayload } from "jsonwebtoken"
import {client} from "@repo/db/client"
import { RoomManager } from "./RoomMananger";
import { WebSocket } from "ws";

const secret = process.env.jwt_secret 
function getRandomString(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
export class User{
    public id: string;
    private x;
    private y;
    private spaceId?:string;
    public userId?:string;
    public ws;

  constructor(ws:WebSocket) {
    this.id= getRandomString(10)
    this.x=0;
    this.y=0;
    this.ws=ws;
    this.init()
    }
//     {
//     "type": "join",
//     "payload": {
// 	    "spaceId": "123",
// 	    "token": "token_received_during_login"
//     }
// }
    init(){
   this.ws.on('message',async(e:string)=>{
    const message=JSON.parse(e.toString());
    if(message.type==="join"){
        const token =message.payload.token;
        const verify =jwt.verify(token,secret as string) as JwtPayload
        if(!verify.userId){
            this.ws.close()
            return ;
        }
        this.userId=verify.userId;
        const space = await client.space.findFirst({
            where:{
                id:message.payload.spaceId
            }
        })
        if(!space){
        this.ws.close()
        return ;
        }
      this.spaceId=message.payload.spaceId
      
        if (!this.spaceId) {
        this.ws.close();
        return;
        }
        RoomManager.getInstance().addUser(this.spaceId,this)
       this.x=Math.floor(Math.random()*space?.width!)
       this.y=Math.floor(Math.random()*space?.height!)
       this.send({
        type:"space-joined",
        payload:{
            spawn:{
                x:this.x,
                y:this.y
            },
            users:RoomManager.getInstance().rooms.get(this.spaceId)?.filter(x=>x.id!=this.id).map(z=>({"userId" : z.userId})) ?? []
        }
       })
     RoomManager.getInstance().broadCast(this.spaceId,this,{"type":"user-join",
        payload:{
            userId: this.userId,
            x:this.x,
            y:this.y
        }
     })

    }else if (message.type=="move") {

        let xDisplacement =Math.abs(message.payload.x-this.x)
        let yDisplacement =Math.abs(message.payload.y-this.y)

        if( (xDisplacement==1 && yDisplacement==0)|| (xDisplacement==0 && yDisplacement==1)){
            this.x=message.payload.x;
            this.y=message.payload.y;
            RoomManager.getInstance().broadCast(this.spaceId!,this,{
                "type": "movement",
                "payload": {
                "x": this.x,
                "y": this.y,
                "userId": this.userId
                }
            
	})
        }else{
            this.send({
                "type": "movement-rejected",
                "payload": {
                    x: this.x,
                    y: this.y
                }
            })
        }


    } 
   

   })
    }

 destroy(){
      RoomManager.getInstance().broadCast(this.spaceId!,this,{      
	"type": "user-left",
	"payload": {
		"userId": this.userId
	}
      })

      RoomManager.getInstance().removeUser(this.spaceId!,this)
    }


    send(message:any){
    this.ws.send(JSON.stringify(message))
    }
}