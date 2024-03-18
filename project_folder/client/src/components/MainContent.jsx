import { Routes,Route } from "react-router-dom";

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

    const {user, token, responseLoginHandler, errors} = props

    return (
        <div className={styles.mainContent}>
            <Routes>
                <Route path="/error" element={<Error errors={errors} token={token} />}/>
                <Route path="/" element={<Home />}/>
                <Route path="/register" element={ <RegisterForm responseLoginHandler={responseLoginHandler} /> }/>
                <Route path="/login" element={ <LoginForm responseLoginHandler={responseLoginHandler} /> }/>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/account" element={ <Account user={user} /> }/>
                <Route path="/account/edit" element={ <AccountForm user={user} /> }/>
                <Route path="/lobbies" element={ <Lobbies /> }/>
                <Route path="/lobbies/create" element={ <LobbyForm user={user} /> }/>
                <Route path="/lobbies/edit" element={ <LobbyForm user={user} /> }/>
                <Route path="/play/:id" element={ <Play user={user} /> }/>
                <Route path="/play" element={ <Play /> }/>
                <Route path="*" element={<Error errors={errors} token={token} />} />
            </Routes>
        </div>
    )
}

export default MainContent;