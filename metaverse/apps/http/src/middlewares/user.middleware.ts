import {Request,Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
const secret="b7b473dcb0356cc74616cb4486f15b58" ;
export const userMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
const token= req.headers?.authorization?.split(" ")[1];
if(!token){
     return res.status(403).json({message:"token not received"})
}
try {
    const validateToken=jwt.verify(token,secret) as {userId:string,role:string};
    
    req.userId= validateToken.userId
    next();
} catch (error) {
     return res.status(401).json({message:"error validating token"})
}
}