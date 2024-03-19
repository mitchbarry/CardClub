import {model, Schema} from 'mongoose';

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required!"],
            minlength: [4, "Username must be at least 4 characters long!"],
            maxlength: [25, "Username must be less than 25 characters long!"]
        },
        email: {
            type: String,
            required: [true, "Email is required!"],
            minlength: [6, "Email must be at least 6 characters long!"],
            maxlength: [255, "Email must be less than 255 characters long!"],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email!"]
        },
        password: {
            type: String,
            required: [true, "Password is required!"],
            minlength: [6, "Password must be at least 6 characters long!"],
            maxlength: [255, "Password must be less than 255 characters long!"]
        },
        birthDate: {
            type: Date,
            required: [true, "Birthday is required!"],
            validate: [
                {
                    validator: function(value) {
                        const today = new Date();
                        const userDate = new Date(value);
                        const yesterday = new Date(today);
                        yesterday.setDate(today.getDate() - 1); // Set the date to yesterday
                        return userDate.getTime() < yesterday.getTime();
                    },
                    message: "Please enter a valid birthday!"
                },
                {
                    validator: function(value) {
                        const today = new Date();
                        const userDate = new Date(value);
                        const age = today.getFullYear() - userDate.getFullYear(); // Calculate age
                        return age >= 18; // Check if the user is at least 18 years old
                    },
                    message: "You must be at least 18 years old!"
                }
            ]
        },
        chips: {
            type: Number,
            required: true,
            default: 1000
        },
        lobbyId: {
            type: String,
            required: false,
            default: ""
        }
    },
    { timestamps: true }
);

const User = model("User", UserSchema);

export default User;