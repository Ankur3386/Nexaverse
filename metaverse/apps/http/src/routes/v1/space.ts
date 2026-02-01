import { Router } from "express";
import { createSpace, deleteAnELementInSpace, deleteSpace, getAllSpace, getSpace } from "../../controllers/space.controller";
import { createElement } from "../../controllers/admin.controller";

export const spaceRouter:Router=Router()
spaceRouter.route('/').post(createSpace)
spaceRouter.route('/:spaceId').get(getSpace)
spaceRouter.route('/:spaceId').delete(deleteSpace)
spaceRouter.route('/element').post(createElement)
spaceRouter.route('/all').post(getAllSpace)
spaceRouter.route('/element').delete(deleteAnELementInSpace)