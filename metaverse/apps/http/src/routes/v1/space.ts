import { Router } from "express";
import { createSpace, deleteAnELementInSpace, deleteSpace, getAllSpace, getSpace } from "../../controllers/space.controller";
import { createElement } from "../../controllers/admin.controller";
import { userMiddleware } from "../../middlewares/user.middleware";

export const spaceRouter:Router=Router()
spaceRouter.route('/').post(userMiddleware,createSpace)
spaceRouter.route('/:spaceId').get(userMiddleware,getSpace)
spaceRouter.route('/:spaceId').delete(userMiddleware,deleteSpace)
spaceRouter.route('/element').post(userMiddleware,createElement)
spaceRouter.route('/all').post(userMiddleware,getAllSpace)
spaceRouter.route('/element').delete(userMiddleware,deleteAnELementInSpace)