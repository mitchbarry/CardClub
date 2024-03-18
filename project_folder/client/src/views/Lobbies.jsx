import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

import lobbyService from "../services/LobbyService";
import Sidebar from "../components/Sidebar";

import styles from "../css/views/Lobbies.module.css";

const Lobbies = () => {

    const [lobbies, setLobbies] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await lobbyService.getAllLobbies();
                setLobbies(response);
            }
            catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={styles.flexBox}>
            <Sidebar />
                <div>
                    <Link to="/lobbies/create" className={styles.blueButton}>+</Link>
                    {lobbies.length === 0 ? (
                        <h2>No lobbies are here! Make one?</h2>
                        ) : (
                            lobbies.map((lobby, index) => (
                                <div key={index}>
                                    <h3>{lobby.name}</h3>
                                    <Link to={`/play/${lobby._id}`}>
                                        Join
                                    </Link>
                                </div>
                            ))
                        )
                    }
                </div>
            <Sidebar />
        </div>
    )
}

export default Lobbies;