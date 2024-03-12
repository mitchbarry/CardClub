import { useState } from "react";

import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Footer from "../components/Footer";

import styles from "../css/Container.module.css";

const Container = () => {

    const [user, setUser] = useState({}); // State to store user information
    const [token, setToken] = useState(""); // State to store authentication token

    const handleLogin = async () => {
        try {
            const loginResponse = await AuthService.login();
            setToken(loginResponse.token); // Set the authentication token in state
            setUser(loginResponse.user); // Set the user information in state
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleLogout = async () => { // Function to handle user logout
        try {
            await AuthService.logout();
            setToken(""); // Clear the authentication token from state
            setUser({}); // Clear the user information from state
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className={styles.container}>
            <Header user={user} handleLogout={handleLogout} />
            <MainContent user={user} token={token} handleLogin={handleLogin} handleLogout={handleLogout} />
            <Footer />
        </div>
    )
}

export default Container;