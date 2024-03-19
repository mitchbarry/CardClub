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
    console.log("V New Socket V")
    console.log(socket.id);
    const socketInfo = { // crete an object that holds the involved parties info
        socketId: socket.id,
        lobbyId: "",
        userId: "",
        connected: false
    };

    socket.on('joinLobby', async ({lobby, user}) => {
        console.log("Player Joined: " + user.username)
        lobby.gameState.players.push({
            userId: user._id,
            name: user.username,
            chips: user.chips,
            lastAction: "",
            hand: [],
            currentBet: 0
        })
        socketInfo.userId = user._id;
        socketInfo.lobbyId = lobby._id;
        socketInfo.connected = true;
        let updatedLobby;
        const options = {
            new: true,
            runValidators: true,
        };
        try {
            console.log("Attempting to add user to players list")
            updatedLobby = await Lobby.findByIdAndUpdate(lobby._id, lobby, options);
        }
        catch (error) {
            next(error)
        }
        finally {
            io.emit('gameStateUpdate', updatedLobby.gameState); // Emit updated gameState to all players in the lobby
        }
    });

    socket.on('leftLobby', async() => {
        if (socketInfo.connected) {
            console.log("Player Left: " + socketInfo.userId)
            removeUserFromLobby(socketInfo);
            socketInfo.connected = false;
        }
    })
    
    socket.on("disconnect", (reason) => {
        if (socketInfo.connected) {
            console.log("Socket disconnected: " + reason);
            removeUserFromLobby(socketInfo);
            socketInfo.connected = false;
        }
    });
});

const removeUserFromLobby = async (socketInfo) => {
    let lobby;
    try {
        lobby = await Lobby.findById(socketInfo.lobbyId);
    }
    catch (error) {
        next(error)
    }
    const userIndex = lobby.gameState.players.findIndex(player => player.userId === socketInfo.userId);
    if (userIndex !== -1) {
        lobby.gameState.players.splice(userIndex, 1); // Remove user from players array
        try {
            const options = {
                new: true,
                runValidators: true,
            };
            console.log("Attempting to remove user from players list")
            await Lobby.findByIdAndUpdate(lobby._id, lobby, options);
        }
        catch (error) {
            next(error);
        }
        finally {
            console.log("Successfully removed player from players list")
            io.emit('gameStateUpdate', lobby.gameState); // Emit updated gameState to all players in the lobby
        }
    }
}