import { Routes,Route,useLocation,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

import Error from "../views/Error";
import Home from "../views/Home";
import RegisterForm from "../views/RegisterForm";
import LoginForm from "../views/LoginForm";
import Dashboard from "../views/Dashboard";
import Account from "../views/Account";
import AccountForm from "../views/AccountForm";
import Lobbies from "../views/Lobbies";
import LobbyForm from "../views/LobbyForm";
import Play from "../views/Play";

import styles from "../css/components/MainContent.module.css";

const MainContent = (props) => {

    const location = useLocation()
    const navigate = useNavigate()

    const {user, token, responseLoginHandler, logoutHandler} = props

    const [error, setError] = useState(null); // State to hold error message

    // ERRORS TO DO: 403 Forbidden (if applicable)
    useEffect(() => {
        setError(null);
        let lowercasePathname = location.pathname.toLowerCase()
        let paths = ["/error", "/", "/register", "/login", "/lobbies", "/play"]
        let authPaths = ["/account", "/account/edit", "/lobbies/create", "/lobbies/edit"]
        let normalizedError = {};
        if (!paths.concat(authPaths)/*.concat(adminPaths)*/.includes(lowercasePathname)) { // 403 forbidden in progress
            normalizedError = {
                statusCode: 404, // Set the status code accordingly
                message: "Resource not found", // Set the error message
                name: "Not Found", // Set the error name
                validationErrors: {}
            };
            setError(normalizedError)
            navigate("/error")
        }
        else if (authPaths.includes(lowercasePathname)) {
            if (token === "") {
                normalizedError = {
                    statusCode: 401,
                    message: "Unauthorized access",
                    name: "Unauthorized",
                    validationErrors: {}
                };
                setError(normalizedError)
                navigate("/error")
            }
        }
        else if ((lowercasePathname === "/login" || lowercasePathname === "/register") && token !== "") {
            navigate("/dashboard")
        }
        /*  403 FORBIDDEN IN PROGRESS
        else if (adminPaths.includes(lowercasePathname)) {
        }
        */
    }, [location.pathname, navigate])

    return (
        <div className={styles.mainContent}>
            <Routes>
                <Route path="/error" element={<Error error={error} token={token} />}/>
                <Route path="/" element={<Home />}/>
                <Route path="/register" element={ <RegisterForm responseLoginHandler={responseLoginHandler} /> }/>
                <Route path="/login" element={ <LoginForm responseLoginHandler={responseLoginHandler} /> }/>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/account" element={ <Account user={user} /> }/>
                <Route path="/account/edit" element={ <AccountForm user={user} /> }/>
                <Route path="/lobbies" element={ <Lobbies /> }/>
                <Route path="/lobbies/create" element={ <LobbyForm /> }/>
                <Route path="/lobbies/edit" element={ <LobbyForm /> }/>
                <Route path="/play" element={ <Play /> }/>
                <Route path="*" element={<Error error={error} token={token} />} />
            </Routes>
        </div>
    )
}

export default MainContent;