import {model, Schema} from 'mongoose';

import User from "./user.model.js";

const LobbySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Lobby name is required!"],
        },
        description: {
            type: String,
            required: false
        },
        maxPlayers: {
            type: Number,
            required: [true, "Number of players is required!"],
            min: [2, "Minimum number of players is 2!"],
            max: [10, "Max number of players is 10!"],
        },
        password: {
            type: String,
            required: false,
            default: ""
        },
        creatorId: {
            type: String,
            required: true
        },
        gameState: {
            type: Object,
            required: true,
            default: {}
        }
    },
    { timestamps: true }
);
const Lobby = model("Lobby", LobbySchema);

export default Lobby;