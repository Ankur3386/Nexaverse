import { Router } from "express";
import {  getOtherUserMetadata,  updateMetadata} from "../../controllers/user.controller";

export const userRouter:Router =Router();
userRouter.route('/metadata').get(updateMetadata);
//pending
userRouter.route('/metadata/bulk').get(getOtherUserMetadata);