import {Request,Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const adminMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
const token= req.headers?.authorization?.split(" ")[1];
if(!token){
     return res.status(403).json({message:"token not received"})
}
try {
    const validateToken=jwt.verify(token,process.env.secret as string) as {userId:string,role:string};
      if(validateToken.role!=="Admin"){
         return res.status(403).json({message:"this endpoint is only for admin"})
    }
    req.userId= validateToken.userId
    next();
} catch (error) {
     return res.status(401).json({message:"error validating token"})
}
}