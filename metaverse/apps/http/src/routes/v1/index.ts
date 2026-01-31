import { Router } from "express";
import { avatars, elements, userSignIn, userSignUp } from "../../controllers/user.controller";
export const router:Router = Router()
router.route('/signup').post(userSignUp)
router.route('/signin').post(userSignIn)
router.route('/elements').get(elements)
router.route('/avatars').get(avatars)
router.use('/admin',)