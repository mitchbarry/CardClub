import { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import AuthService from "../services/AuthService";

import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Footer from "../components/Footer";

import styles from "../css/components/Container.module.css";

const Container = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const [user, setUser] = useState({}); // State to store user information
    const [token, setToken] = useState(""); // State to store authentication token

    const tokenLoginHandler = async (token) => {
        try {
            const userResponse = await AuthService.getUserInfo(token);
            setToken(token); // Set the token and user information in state
            setUser(userResponse.data);
        }
        catch (error) {
            console.error("Login failed:", error); // Handle login error
        }
    };

    const responseLoginHandler = async (responseData) => {
        Cookies.set("token", responseData.token, { expires: 7 }); // Set the token as a browser cookie with an expiry time (1 week)
        setToken(responseData.token); // Set the token and user information in state
        setUser(responseData.user);
    };

    const logoutHandler = async () => { // Function to handle user logout
        let authPaths = ["/account", "/account/edit", "/lobbies/create", "/lobbies/edit"]
        let lowercasePathname = location.pathname.toLowerCase()
        try {
            await AuthService.logout(/*token*/); // token may be passed through to invalidate it via a blacklist (have not yet implemented)
            setToken(""); // Clear the authentication token from state
            setUser({}); // Clear the user information from state
            Cookies.remove('token');
            if (authPaths.includes(lowercasePathname)) {
                navigate("/");
            }
        }
        catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        let token = Cookies.get("token");
        if (token) {
            tokenLoginHandler(token);
        }
    }, [])

    return (
        <div className={styles.container}>
            <Header token={token} user={user} logoutHandler={logoutHandler} />
            <MainContent user={user} token={token} responseLoginHandler={responseLoginHandler}/>
            <Footer />
        </div>
    )
}

export default Container;