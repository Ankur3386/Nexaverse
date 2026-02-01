import { Router } from "express";
import { getAllavatars, getAllelements, userSignIn, userSignUp } from "../../controllers/user.controller";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
export const router:Router = Router()
router.use('/admin',adminRouter)
router.use('/user',userRouter)
router.use('/space',spaceRouter)
//routes
router.route('/signup').post(userSignUp)
router.route('/signin').post(userSignIn)
router.route('/elements').get(getAllelements)
router.route('/avatars').get(getAllavatars)
