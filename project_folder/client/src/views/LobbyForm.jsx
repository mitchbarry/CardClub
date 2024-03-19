import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import userService from "../services/UserService";
import lobbyService from "../services/LobbyService";
import Sidebar from "../components/Sidebar";

import styles from "../css/views/LobbyForm.module.css";

const LobbyForm = (props) => {
    
    const {user} = props;

    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(6);
    const [password, setPassword] = useState("");
    const [lobby, setLobby] = useState({});
    const [errors, setErrors] = useState({});
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (user.lobbyId) {
            const getLobby = async () => {
                let lobby;
                try {
                    lobby = await lobbyService.getOneLobby(user.lobbyId);
                }
                catch (error) {
                    catchError(error);
                }
                finally {
                    setName(lobby.name);
                    setDescription(lobby.description);
                    setMaxPlayers(lobby.maxPlayers);
                    setPassword(lobby.password);
                    setLobby(lobby)
                }
            }
            getLobby();
        }
    },[user]);
    
    const inputHandler = (e) => {
        switch(e.target.id) {
            case "name":
                return nameHandler(e);
            case "description":
                return descriptionHandler(e);
            case "maxPlayers":
                return maxPlayersHandler(e);
            case "password":
                return passwordHandler(e);
            default:
                return;
        }
    };

    const nameHandler = (e) => {
        setName(e.target.value);
    }

    const descriptionHandler = (e) => {
        setDescription(e.target.value);
    }
    
    const maxPlayersHandler = (e) => {
        let value = e.target.value;
        if (value < 2) {
            setMaxPlayers(2);
        }
        else if (value > 10) {
            setMaxPlayers(10);
        }
        else {
            setMaxPlayers(value);
        }
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        sendRequest();
    };

    const sendRequest = async () => {
        if (user.lobbyId) {
            if (lobby.name !== name ||
                lobby.description !== description ||
                lobby.maxPlayers !== maxPlayers ||
                lobby.password !== password) {
                    try {
                        await lobbyService.updateOneLobby({
                            _id: user.lobbyId,
                            name: name.trim() ? name : user.username + "'s Lobby",
                            description: description.trim(),
                            maxPlayers: maxPlayers,
                            password: password.trim()
                        })
                    }
                    catch (error) {
                        catchError(error);
                    }
                    finally {
                        navigate("/lobbies");
                    }
                }
            else {
                navigate("/lobbies");
            }
        }
        else {
            let lobby;
            try {
                lobby = await lobbyService.createOneLobby({
                    name: name.trim() ? name : user.username + "'s Lobby",
                    description: description.trim(),
                    maxPlayers: maxPlayers,
                    password: password.trim(),
                    creatorId: user._id,
                    gameState: {
                        state: 0,
                        deck: [],
                        river: [],
                        pot: 0,
                        highestBet: 0,
                        playersFolded: 0,
                        winners: [],
                        players: [],
                        currentlyGoing: 0,
                        dealerIndex: 0
                    }
                });
            }
            catch (error) {
                catchError(error);
            }
            finally {
                try {
                    let newUser = user;
                    newUser.lobbyId = lobby._id
                    await userService.updateOneUser(newUser)
                }
                catch (error) {
                    catchError(error);
                }
                finally {
                    navigate("/lobbies");
                }
            }
        }
    }

    const closeNotification = () => {
        setShowNotification(false);
    }

    const catchError = (error) => {
        console.error(error)
        if (error.response) { // Handle registration error if server returns an error response
            setErrors(error.response.data)
        }
        else if (error.request) { // Handle network errors
            const normalizedError = {
                statusCode: 500, // Assuming a generic status code for network errors
                message: "A network error occurred. Please check your internet connection and try again.",
                name: "NetworkError",
                validationErrors: {}
            };
            setErrors(normalizedError)
        }
        else { // Handle unexpected errors
            const normalizedError = {
                statusCode: 500, // Assuming a generic status code for unexpected errors
                message: "An unexpected error occurred. Please try again later.",
                name: "UnexpectedError",
                validationErrors: {}
            };
            setErrors(normalizedError)
        }
        setShowNotification(true);
    }

    return (
        <div className={styles.flexBox}>
            <Sidebar />
            <div>
                {(Object.keys(errors).length !== 0  && showNotification) && (
                    <ul className={styles.flashBox}>
                        <button className={styles.closeButtonRed} onClick={() => closeNotification()}>x</button>
                        {errors.statusCode && errors.name && (
                            <li className={styles.flashBoxLi}>
                                Error {errors.statusCode}: {errors.name} 
                            </li>
                        )}
                        {errors.message && (
                            <li className={styles.flashBoxLi}>
                                {errors.message}
                            </li>
                        )}
                        {errors.validationErrors && errors.validationErrors.length !== 0 && (
                            Object.keys(errors.validationErrors).map((key, index) => (
                                <li key={index} className={styles.flashBoxLi}>
                                    {errors.validationErrors[key]}
                                </li>
                            ))
                        )}
                    </ul>
                )}
                <form className={styles.flexForm} onSubmit={submitHandler}>
                    <label htmlFor="name" className={styles.whiteLabel}>Name: (optional)</label>
                    <input className={styles.textfieldMarginBottom} type="text" id="name" name="name" value={name} onChange={(e) => inputHandler(e)}></input>
                    <label htmlFor="description" className={styles.whiteLabel}>Description: (optional)</label>
                    <input className={styles.textfieldMarginBottom} type="text" id="description" name="description" value={description} onChange={(e) => inputHandler(e)}></input>
                    <label htmlFor="maxPlayers" className={styles.whiteLabel}>Max Players:</label>
                    <input className={styles.textfieldMarginBottom} type="number" id="maxPlayers" name="maxPlayers" value={maxPlayers} onChange={(e) => inputHandler(e)}></input>
                    <label htmlFor="password" className={styles.whiteLabel}>Password: (optional)</label>
                    <input className={styles.textfieldMarginBottom} type="password" id="password" name="password" value={password} onChange={(e) => inputHandler(e)}></input>
                    <button className={styles.blueButton} type="submit">
                        {user.lobbyId === "" ? "Create" : "Update"}
                    </button>
                </form>
            </div>
            <Sidebar />
        </div>
    );
}

export default LobbyForm;