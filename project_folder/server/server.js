import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import dbConnect from './config/mongoose.config.js';
import router from './routes/poker.routes.js';
import utilities from "./utilities/poker.utilities.js"

dbConnect();

const app = express();

app.use(express.json(), cors());

dotenv.config();

const PORT = process.env.PORT;

app.use('/api', router);

app.use((req, res, next) => {
    const error = new Error("Not Found")
    error.statusCode = 404
    error.name = "Not Found"
    next(error)
})

app.use((error, req, res, next) => {
    error.name === "ValidationError" ? error.statusCode = 400 : ""
    console.error(error.errors)
    const normalizedError = {
        statusCode: error.statusCode || 500,
        message: error.message || "Something went wrong.",
        name: error.name || "Server Error.",
        validationErrors: utilities.extractValidationErrors(error)
    }
    res.status(normalizedError.statusCode).json(normalizedError)
})

app.listen(PORT, () =>
    console.log(`Listening on port: ${PORT}`)
);