import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import dbConnect from './config/mongoose.config.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import lobbyRouter from './routes/lobby.routes.js';
import utilities from "./utilities/error.utilities.js"

import Lobby from './models/lobby.model.js';

dbConnect();

const app = express();

app.use(express.json(), cors());

dotenv.config();

const PORT = process.env.PORT;

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/lobbies', lobbyRouter);

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

const server = app.listen(PORT, () =>
    console.log(`Listening on port: ${PORT}`)
);

const io = new Server(server, {cors: true});

io.on("connection", socket => {
    console.log(socket.id);
    socket.on('playerJoin', async ({lobby, user}) => {
        lobby.gameState.players.push({
            userId: user._id,
            name: user.username,
            chips: user.chips,
            lastAction: "",
            hand: [],
            currentBet: 0
        })
        const options = {
            new: true,
            runValidators: true,
        };
        try {
            const updatedLobby = await Lobby.findByIdAndUpdate(lobby._id, lobby, options);
            io.to(lobby._id).emit('gameStateUpdate', updatedLobby.gameState); // Emit updated gameState to all players in the lobby
        }
        catch (error) {
            next(error)
        }
    });
    socket.on('playerLeft', async({lobby, user}) => {
        const userIndex = lobby.gameState.players.findIndex(player => player.userId === user._id);
        if (userIndex !== -1) {
            lobby.players.splice(userIndex, 1); // Remove user from players array
        }
        try {
            const options = {
                new: true,
                runValidators: true,
            };
            const updatedLobby = await Lobby.findByIdAndUpdate(lobby._id, lobby, options);
            io.to(lobby._id).emit('gameStateUpdate', updatedLobby.gameState); // Emit updated gameState to all players in the lobby
        }
        catch (error) {
            next(error);
        }
    })
})