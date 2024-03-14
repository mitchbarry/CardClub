import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import styles from "../css/views/Home.module.css";

const Home = () => {

    return (
        <div>
            <Sidebar />
            <h1>
                Welcome to Card Club!
            </h1>
            <h2>
                Our website is amazing! We have so many users! Shill shill shill!
            </h2>
            <Link to="/play" className={styles.blueButton}>Play Now</Link>
            <Link to="/lobbies" className={styles.blueButton}>Browse Lobbies</Link>
            <Sidebar />
        </div>
    )
}

export default Home;