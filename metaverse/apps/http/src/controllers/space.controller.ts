import { Request,Response,NextFunction } from "express";
import { addElementSchema, createSpaceSchema, deleteElementSchema } from "../utils/types";
import { client } from "@repo/db/client";

export const createSpace=async(req:Request,res:Response,next:NextFunction)=>{
    //2cases here 
    // if mapId given than take dimensions from map
    // if mapId not given than take dimensions and other data from req.body

const parsedData =createSpaceSchema.safeParse(req.body)
if(!parsedData.success){
    return res.status(400).json({message: "send correct space data"})
}
if(!parsedData.data.mapId){
const space= await client.space.create({
    data:{
        name:parsedData.data.name,
        width:parseInt(parsedData.data.dimensions.split("x")[0]??"0"),
        height:parseInt(parsedData.data.dimensions.split("x")[1]??"0"),
        creatorId:req.userId!
    }
})
return res.status(200).json({spaceId:space.id})
}
const map = await client.map.findFirst({
    where:{
        id:parsedData.data.mapId
    },
    select:{
  height:true,
  width:true,
  mapElements:true,
    }
})
if(!map){
    return res.status(400).json({message: "wrong mapId"})
}
let space = await client.$transaction(async()=>{
const space=await client.space.create({
    data:{
        name:parsedData.data.name,
        height:map.height,
        width:map.width,
        creatorId:req.userId!
    }
});

await client.spaceElements.createMany({
    data:map.mapElements.map(q=>({
        spaceId:space.id,
        elementId:q.elementId,
        x:q.x!,
        y:q.y!,
    }))


    
})

return space;
})
if(!space){
  return res.status(400).json({message: "error creating map"})

}
return res.status(200).json({spaceId:space.id})
}
export const deleteSpace=async(req:Request,res:Response,next:NextFunction)=>{
const spaceId=req.params.spaceId;

if(  Array.isArray(spaceId) || typeof(spaceId)!=="string"){
    return res.status(400).json({message: "send spaceId"})

}
const space= await client.space.findUnique({
    where:{
        id:spaceId
    },select:{
        creatorId: true
    }
}) 

if(!space){
return res.status(400).json({message:"space does not exist"})
    
}
if(space.creatorId!==req.userId){
return res.status(400).json({message:"space is owned by someone else so you can't delete space"})
}

await client.space.delete({
    where:{
        id:spaceId
    }
})
return res.status(200).json({message:"sppace deleted"})
}
export const getSpace=async(req:Request,res:Response,next:NextFunction)=>{
    const spaceId = req.params.spaceId
    if(  Array.isArray(spaceId) || typeof(spaceId)!=="string"){
    return res.status(400).json({message: "send spaceId"})

}
    const space = await client.space.findUnique({
        where:{
            id:spaceId
        },
        include:{
            elements:{
                include:{
                    element:true
                }
            }
        }
    })
    if(!space){
    return res.status(400).json({message:"space does not exist with this sapceId "})
    }
    return res.status(200).json({
        dimensions:`${space.width}x${space.height}`,
        elements:space.elements.map(q=>({
           id:q.id,
           element:{
            id:q.element.id,
            height:q.element.height,
            width:q.element.width,
            static:q.element.static,
            imageUrl:q.element.imageUrl
           },
           x:q.x,
           y:q.y
        }))
    })

}
export const getAllSpace=async(req:Request,res:Response,next:NextFunction)=>{
const space = await client.space.findMany({
    where:{
        creatorId:req.userId
    }
});
if(!space){
    return res.status(400).json({message:"space not found "})
}
return res.status(200).json({spaces: space.map(q=>({
    id:q.id,
    name:q.name,
    thumbnail:q.thumbnail,
    dimensions:`${q.width}x${q.height}`
}))})
}
export const addElementInSpace=async(req:Request,res:Response,next:NextFunction)=>{
const parsedData= addElementSchema.safeParse(req.body)
if(!parsedData.success){
    return res.status(400).json({message:"send correct data"})
}
const space= await client.space.findUnique({
    where:{
        id:parsedData.data.spaceId,
        creatorId:req.userId
    },
    select:{
        width:true,
        height:true
    }
})
if(!space){
    return res.status(400).json({message:"space not found "})   
}
if(parsedData.data.x>space.width ||parsedData.data.y>space.height || parsedData.data.y<0||parsedData.data.x<0){
    return res.status(400).json({message:" x and y are out of bound"})
}
await client.spaceElements.create({
    data:{
        spaceId:parsedData.data.spaceId,
        elementId:parsedData.data.elementId,
        x:parsedData.data.x,
        y:parsedData.data.y
    }
})
    return res.status(200).json({message:"element added in the space "})

}
export const deleteAnELementInSpace=async(req:Request,res:Response,next:NextFunction)=>{
const parsedData= deleteElementSchema.safeParse(req.body)
if(!parsedData.success){
    return res.status(400).json({message:"send correct data "})
}
const spaceElements= await client.spaceElements.findFirst({
    where:{
        id:parsedData.data.id
    },
    include:{
        space:true
    }
})
if(!spaceElements){
    return res.status(400).json({message:"element not found in space"})
}
if(!spaceElements.space.creatorId || spaceElements.space.creatorId!==req.userId){
    return res.status(400).json({message:"Unauthorized"})
}
await client.spaceElements.delete({
    where:{
        id:parsedData.data.id
    }
})
     return res.status(200).json({message:"ELement deleted "})

}