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
    const [errors, setErrors] = useState({}); // State to hold error message
    const [intendedRoute, setIntendedRoute] = useState("");

    const paths = ["/error", "/", "/register", "/login", "/lobbies", "/play"]
    const authPaths = ["/dashboard", "/account", "/account/edit", "/lobbies/create", "/lobbies/edit"]

    const tokenLoginHandler = async (token) => {
        try {
            const userResponse = await AuthService.getUserInfo(token);
            setToken(token); // Set the token and user information in state
            setUser(userResponse.user);
        }
        catch (error) {
            console.error("Login failed:", error); // Handle login error
        }
        finally {
            if (intendedRoute) {
                navigate(intendedRoute);
                setIntendedRoute("");
            }
            else {
                navigate("/dashboard");
            }
        }
    };

    const responseLoginHandler = (response) => {
        Cookies.set("token", response.token, { expires: 7 }); // Set the token as a browser cookie with an expiry time (1 week)
        setToken(response.token); // Set the token and user information in state
        setUser(response.newUser);
        if (intendedRoute) {
            navigate(intendedRoute);
            setIntendedRoute("");
        }
        else {
            navigate("/dashboard");
        }
    };

    const logoutHandler = async () => { // Function to handle user logout
        let lowercasePathname = location.pathname.toLowerCase()
        try {
            await AuthService.logout(/*token*/); // token may be passed through to invalidate it via a blacklist (have not yet implemented)
            setToken(""); // Clear the authentication token from state
            setUser({}); // Clear the user information from state
            Cookies.remove("token");
            if (authPaths.includes(lowercasePathname)) {
                navigate("/");
            }
        }
        catch (error) {
            console.error("Logout failed:", error);
        }
    };

        useEffect(() => {
            const cookieToken = Cookies.get("token");
            const lowercasePathname = location.pathname.toLowerCase()
            let normalizedError = {};
            setErrors({});
            if (!paths.concat(authPaths).includes(lowercasePathname)) { // 403 forbidden in progress (if applicable) (.concat(adminPaths))
                console.log(lowercasePathname)
                normalizedError = {
                    statusCode: 404, // Set the status code accordingly
                    message: "Resource not found", // Set the error message
                    name: "Not Found", // Set the error name
                    validationErrors: {}
                };
                setErrors(normalizedError)
                navigate("/error");
            }
            else if (authPaths.includes(lowercasePathname)) {
                if (!cookieToken) {
                    normalizedError = {
                        statusCode: 401,
                        message: "Unauthorized access",
                        name: "Unauthorized",
                        validationErrors: {}
                    };
                    setErrors(normalizedError)
                    console.error(normalizedError);
                    setIntendedRoute(lowercasePathname);
                    navigate("/login");
                }
                else {
                    if (!token) {
                        setIntendedRoute(lowercasePathname);
                        tokenLoginHandler(cookieToken);
                    }
                }
            }
            else if ((lowercasePathname === "/login" || lowercasePathname === "/register") && token) {
                navigate("/dashboard");
            }
            /*  403 FORBIDDEN IN PROGRESS
            else if (adminPaths.includes(lowercasePathname)) {
            }
            */
        }, [location.pathname])

    return (
        <div className={styles.container}>
            <Header token={token} user={user} logoutHandler={logoutHandler} />
            <MainContent user={user} token={token} responseLoginHandler={responseLoginHandler} errors ={errors} />
            <Footer />
        </div>
    )
}

export default Container;