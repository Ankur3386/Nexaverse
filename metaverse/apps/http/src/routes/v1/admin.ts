import { Router } from "express";
import { createAvatar, createElement, updateElement } from "../../controllers/admin.controller";

export const adminRouter:Router= Router();
adminRouter.route('/element').post(createElement)
adminRouter.route('/element/:elementId').put(updateElement)
adminRouter.route('/avatar').post(createAvatar)
adminRouter.route('/map').post(createAvatar)