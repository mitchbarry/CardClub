import { Router } from "express";

import userController from "../controllers/user.controller.js";

const router = Router();

router.route("/account")
    .get(userController.getOneUser)

router.route("/account/edit")
    .get(userController.getOneUser)
    .delete(userController.deleteOneUser)
    .put(userController.updateOneUser)

export default router