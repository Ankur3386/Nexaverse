import { Router } from "express";
import { createAvatar, createElement, updateElement } from "../../controllers/admin.controller";
import { adminMiddleware } from "../../middlewares/admin.middleware";

export const adminRouter:Router= Router();
adminRouter.route('/element').post(adminMiddleware,createElement)
adminRouter.route('/element/:elementId').put(adminMiddleware,updateElement)
adminRouter.route('/avatar').post(adminMiddleware,createAvatar)
adminRouter.route('/map').post(adminMiddleware,createAvatar)