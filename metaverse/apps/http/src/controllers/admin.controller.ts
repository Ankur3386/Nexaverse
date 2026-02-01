import {Request,Response, NextFunction } from "express";
import { createAvatarSchema, createElementSchema, createMapSchema, updateElementSchema } from "../utils/types";
import { client } from "@repo/db/client";
import { parse } from "path";
import { id } from "zod/locales";

export const createElement=async(req:Request,res:Response,next:NextFunction)=>{
 const parsedData= createElementSchema.safeParse(req.body)
 if(!parsedData.success){
     return res.status(400).json({message: "send correct element details"})
 }
 const element= await client.element.create({
data:{
    imageUrl:parsedData.data.imageUrl,
    height:parsedData.data.height,
    width:parsedData.data.width,
    static:parsedData.data.static
}
 })
 if(!element){
     return res.status(400).json({message: "error creating ellement"})
    
 }
return  res.status(200).json({id:element.id})
}
export const updateElement=async(req:Request,res:Response,next:NextFunction)=>{
const parsedData= updateElementSchema.safeParse(req.body);
if(!parsedData.success){
     return res.status(400).json({message: "only correct imageUrl can be updated"})
}
const elementIdParam = req.params.elementId;
// done as req.params has type String |String[] so we accept String but we dont need String[]so if String[] throe error 
if (typeof elementIdParam !== "string") {
  return res.status(400).json({
    message: "Invalid element id",
  });
}
const elementId=elementIdParam
if(!parsedData.success){
     return res.status(400).json({message: "send correct update details"})
}
const updatedElement= await client.element.update({
    where:{
        id:elementId
    },
    data:{
        imageUrl:parsedData.data.imageUrl
    }
})
if(!updatedElement){
     return res.status(400).json({message: "error updating element or worng elementId"})
}

}
export const createAvatar=async(req:Request,res:Response,next:NextFunction)=>{
    const parsedData= createAvatarSchema.safeParse(req.body)
    if(!parsedData.success){
             return res.status(400).json({message: "send correct avatar data"})
    }
try {
    const avatar = await client.avatar.create({
        data:{
            imageUrl:parsedData.data.imageUrl,
            name:parsedData.data.name
        }
    })
    if(!avatar){
             return res.status(400).json({message: "error creating avatar"})
    
    }
    return res.status(200).json({avatarId:avatar.id})
} catch (error) {
    return res.status(400).json({message: "server error"})
    
}
}
export const createMap=async(req:Request,res:Response,next:NextFunction)=>{
const parsedData= createMapSchema.safeParse(req.body)
if(!parsedData.success){
 return res.status(400).json({message: "send correct map details"})
}
const map=await client.map.create({
    data:{
        thumbnail:parsedData.data.thumbnail,
        width:parseInt(parsedData.data.dimensions.split("x")[0]??"0"),
        height:parseInt(parsedData.data.dimensions.split("x")[1]??"0"),
        name:parsedData.data.name,
        mapElements:{
            create:parsedData.data.defaultElements.map(q=>({
            elementId:q.elementId,
            x:q.x,
            y:q.y
        }))}
    }
})
if(!map){
    return res.status(400).json({message: "error creating map"})
}
return res.status(200).json({id:map.id})
}