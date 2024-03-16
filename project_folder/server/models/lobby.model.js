import {model, Schema} from 'mongoose';

import User from "./user.model.js";

const LobbySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Lobby name is required!"],
            minlength: [4, "Lobby name must be at least 4 characters long!"],
            maxlength: [25, "Lobby name must be less than 25 characters long!"]
        },
        description: {
            type: String,
            required: false,
            minlength: [4, "Description must be at least 4 characters long!"],
            maxlength: [255, "Description must be less than 255 characters long!"],
            default: ""
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
            type: String, // Reference to the User who created the lobby
            required: true
        },
        gameState: {
            type: Object,
            required: true
        },
        players: {
            type: [{ type: Schema.Types.ObjectId, ref: User }],
            default: [],
            validate: {
                validator: function(players) {
                    return players.length <= this.maxPlayers; // Validate maximum number of players
                },
                message: props => `Cannot exceed ${props.maxPlayers} players in the lobby!`
            }
        },
        spectators: {
            type: [{ type: Schema.Types.ObjectId, ref: User }],
            default: []
        }
    },
    { timestamps: true }
);
const Lobby = model("Lobby", LobbySchema);

export default Lobby;