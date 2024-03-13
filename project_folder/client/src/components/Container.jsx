import { useState } from "react";
import Cookies from "js-cookie";

import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Footer from "../components/Footer";

import styles from "../css/components/Container.module.css";

const Container = () => {

    const [user, setUser] = useState({}); // State to store user information
    const [token, setToken] = useState(""); // State to store authentication token

    const loginHandler = async (responseData = null) => {
        try {
            const loginResponse = responseData || await AuthService.login();
            setToken(loginResponse.token); // Set the authentication token in state
            setUser(loginResponse.user); // Set the user information in state
            Cookies.set("token", loginResponse.token, { expires: 7 }); // Set the token as a browser cookie with an expiry time (1 week)
        } catch (error) {
            console.error("Login failed:", error); // Handle login error
        }
    };

    const logoutHandler = async () => { // Function to handle user logout
        try {
            await AuthService.logout();
            setToken(""); // Clear the authentication token from state
            setUser({}); // Clear the user information from state
            Cookies.remove('token');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className={styles.container}>
            <Header user={user} logoutHandler={logoutHandler} />
            <MainContent user={user} token={token} loginHandler={loginHandler} logoutHandler={logoutHandler} />
            <Footer />
        </div>
    )
}

export default Container;