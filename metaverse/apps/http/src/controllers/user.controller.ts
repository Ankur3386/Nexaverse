import { NextFunction,Request,Response } from "express";
import { signInSchema, signUpSchema, updateMetadataSchema } from "../utils/types";
import { client } from "@repo/db/client";
import bcrypt from  "bcryptjs"
import  jwt  from "jsonwebtoken";
import id from "zod/v4/locales/id.js";
const secret="b7b473dcb0356cc74616cb4486f15b58" ;
const userSignUp=async(req:Request,res:Response,next:NextFunction)=>{
     const parsedData = signUpSchema.safeParse(req.body)
    if(!parsedData.success){
     return   res.status(400).json({message:"correct crendential required "})
    }
    const hashesPassword=await bcrypt.hash(parsedData.data.password,10)
   try {
     const existingUser = await client.user.findFirst({
      where:{
        username:parsedData.data.username
      }
     })
     if(existingUser){
   return res.status(400).json({message:"user already exist with this username"})
     }
     const user = await client.user.create({
         data:{
             username:parsedData.data.username,
             password:hashesPassword,
             role:parsedData.data.role==="Admin"?"Admin":"User"
         }
     })
     if(!user){
         return res.status(400).json({message:"error creating the user"})
     }
      res.json({
            userId: user.id
        })
   } catch (error) {
    res.status(400).json({message: "User already exists"})
   }
 
}
const userSignIn=async(req:Request,res:Response,next:NextFunction)=>{
const parsedData = signInSchema.safeParse(req.body)
if(!parsedData.success){
    return res.status(400).json({message:"credentials incorrect"})
}
 try {
    const user = await client.user.findUnique({
       where:{
           username:parsedData.data.username
       }
    })
    if(!user){
       return res.status(400).json({message:"user does not exist "})
    }
    const validatePassword =await bcrypt.compare(parsedData.data.password,user.password);
    if(!validatePassword){
       return res.status(400).json({message:"incorrect password"})
    }
    const token = jwt.sign({
   userId:user.id,
   role:user.role
    },
   secret,
   {expiresIn:"4d"});
   if(!token){
    return res.status(400).json({message:"token not created successfully"})
   }
   return res.status(200).json({token})
 } catch (error) {
     return res.status(400).json({message:"server error"})
 }
}

const getAllelements=async(req:Request,res:Response,next:NextFunction)=>{
const allElements= await client.element.findMany();
if(!allElements){
     return res.status(400).json({message: "error fetching elemsnts"})
}
return res.status(200).json({elements:allElements.map(x=>({
    id:x.id ,
    imageUrl:x.imageUrl,
    width:x.width,
    height:x.height,
    static:x.static
}))})
}
const getAllavatars=async(req:Request,res:Response,next:NextFunction)=>{
try {
    const allAvatar= await client.avatar.findMany();
    if(!allAvatar){
           return res.status(400).json({message: "error fetching avatar"})
    }
    res.status(200).json({avatars:allAvatar.map((x)=>({
        id:x.id,
        imageUrl:x.imageUrl,
        name:x.name
    }))})
} catch (error) {
     return res.status(400).json({message: "server error"})
}
}
const updateMetadata=async(req:Request,res:Response,next:NextFunction)=>{
    const parsedData= updateMetadataSchema.safeParse(req.body)
    if(!parsedData.success){
         return res.status(400).json({message:"give correct avatarId"})
    }
try {
    const user= await client.user.update({
        where:{
            id:req.userId
        },
        data:{
        avatarId:parsedData.data.avatarId
        }
    })
   return res.status(200).json({message: "Metadata updated"})
} catch (error) {
    return    res.status(403).json({message: "internal server error"})
}
}
const getOtherUserMetadata=async(req:Request,res:Response,next:NextFunction)=>{

}

export{
    userSignIn,userSignUp,getAllelements,getAllavatars,updateMetadata,getOtherUserMetadata
}