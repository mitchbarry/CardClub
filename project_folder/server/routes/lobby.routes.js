import { Router } from "express";

import lobbyController from "../controllers/lobby.controller.js";

const router = Router();

router.route("/lobbies")
    .get(lobbyController.getAllLobbies)

router.route("/lobbies/:id")
    .get(lobbyController.getOneLobby)

router.route("/lobbies/create")
    .post(lobbyController.createLobby)

router.route("/lobbies/edit")
    .put(lobbyController.updateOneLobby)
    .delete(lobbyController.deleteOneLobby)

export default router