import {model, Schema} from 'mongoose';

import Lobby from "./lobby.model.js";

const UserSchema = new Schema(
    {
        userName: {
            type: String,
            required: [true, "Username is required!"],
            minlength: [4, "Username must be at least 4 characters long!"],
            maxlength: [25, "Username must be less than 25 characters long"]
        },
        email: {
            type: String,
            required: [true, "Email is required!"],
            minlength: [6, "Email must be at least 6 characters long!"],
            maxlength: [255, "Email must be less than 255 characters long"],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"]
        },
        password: {
            type: String,
            required: [true, "Password is required!"],
            minlength: [6, "Password must be at least 6 characters long!"],
            maxlength: [255, "Password must be less than 255 characters long"]
        },
        birthDate: {
            type: Date,
            required: [true, "Birthday is required!"],
            validate: {
                validator: function(value) {
                    const today = new Date(); // Check if the user is at least 18 years old
                    const age = today.getFullYear() - value.getFullYear();
                    return age >= 18;
                },
                message: "You must be at least 18 years old!"
            }
        },
        createdLobby: {
            type: Schema.Types.ObjectId, // Reference to the lobby created by the user
            ref: 'Lobby'
        },
        joinedLobby: {
            type: Schema.Types.ObjectId, // Reference to the lobby joined by the user
            ref: 'Lobby'
        },
    },
    { timestamps: true }
);
const User = model("User", UserSchema);

export default User;