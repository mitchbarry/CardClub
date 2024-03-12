import { Routes,Route,useLocation,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

import CardClubService from "../services/CardClubService";

import styles from "../css/MainContent.module.css";
import Sidebar from "../components/Sidebar";
import Poker from "../views/Poker";

const MainContent = (props) => {

    const location = useLocation()
    const navigate = useNavigate()

    const {user, token, loginHandler, logoutHandler} = props

    const mealUpdater = (newMeal) => {
        setMeal(() => newMeal)
    }

    useEffect(() => {
        if (location.pathname === "/") {
            setMeal({})
            navigate("/meals")
            return
        }
        let lowercasePathname = location.pathname.toLowerCase()
        let paths = ["/meals","/meals/new", "/error404"]
        if (paths.includes(lowercasePathname)) {
            setMeal({})
            return
        }
        if (MealService.pathValidator(lowercasePathname)) {
            return
        }
        else {
            setMeal({})
            navigate("/error404")
        }
    }, [location.pathname])

    return (
        <div className={styles.mainContent}>
            <Routes>
                <Route path="/error" element={<Error />}/>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={ <RegisterForm /> }/>
                <Route path="/login" element={ <LoginForm /> }/>
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