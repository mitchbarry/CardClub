import { Routes,Route,useLocation,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

import Error from "../views/Error";
import Home from "../views/Home";
import RegisterForm from "../views/RegisterForm";
import LoginForm from "../views/LoginForm";
import Account from "../views/Account";
import AccountForm from "../views/AccountForm";
import Lobbies from "../views/Lobbies";
import LobbyForm from "../views/LobbyForm";
import Play from "../views/Play";

import styles from "../css/components/MainContent.module.css";

const MainContent = (props) => {

    const location = useLocation()
    const navigate = useNavigate()

    const {user, token, loginHandler, logoutHandler} = props

    const [error, setError] = useState(null); // State to hold error message

    // ERRORS TO DO: 401 Unauthorized, 403 Forbidden?, Timeout page?
    useEffect(() => {
        setError(null);
        let lowercasePathname = location.pathname.toLowerCase()
        let paths = ["/error", "/", "/register", "/login", "/account", "/account/edit", "/lobbies", "/lobbies/create", "/lobbies/edit", "/play"]
        if (!paths.includes(lowercasePathname)) {
            navigate("/error")
            const normalizedError404 = {
                statusCode: 404, // Set the status code accordingly
                message: "Resource not found", // Set the error message
                name: "Not Found", // Set the error name
                validationErrors: {}
            };
            setError(normalizedError404)
        }
    }, [location.pathname, navigate])

    return (
        <div className={styles.mainContent}>
            <Routes>
                <Route path="/error" element={<Error error={error} />}/>
                <Route path="/" element={<Home />}/>
                <Route path="/register" element={ <RegisterForm loginHandler={loginHandler} /> }/>
                <Route path="/login" element={ <LoginForm /> }/>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/account" element={ <Account meal={meal} mealUpdater={mealUpdater}/> }/>
                <Route path="/account/edit" element={ <AccountForm meal={meal} mealUpdater={mealUpdater}/> }/>
                <Route path="/lobbies" element={ <Lobbies meal={meal} mealUpdater={mealUpdater}/> }/>
                <Route path="/lobbies/create" element={ <LobbyForm meal={meal} mealUpdater={mealUpdater}/> }/>
                <Route path="/lobbies/edit" element={ <LobbyForm meal={meal} mealUpdater={mealUpdater}/> }/>
                <Route path="/play" element={ <Play meal={meal} mealUpdater={mealUpdater}/> }/>
                <Route path="*" element={<Error />}/>
            </Routes>
            
        </div>
    )
}

export default MainContent;