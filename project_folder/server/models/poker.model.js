import {model, Schema} from 'mongoose';
const PokerSchema = new Schema(
    {
        example: {
            type: String,
            required: [true, "Title is required!"],
            minlength: [2, "Title must be at least 2 characters long!"],
            maxlength: [255, "Title must be less than 255 characters long"]
        }
    },
    { timestamps: true }
);
const Poker = model("Poker", PokerSchema);
export default Poker;