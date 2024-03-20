import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import styles from "../css/views/Home.module.css";

const Home = () => {

    return (
        <div className={styles.flexBox}>
            <Sidebar />
            <div className={styles.mainItem}>
                <h1>
                    Welcome to Card Club!
                </h1>
                <h2>
                    Our website is amazing! We have so many users!
                </h2>
                <Link to="/play" className={styles.blueButton}>Play Now</Link>
                <Link to="/lobbies" className={styles.blueButton}>Browse Lobbies</Link>
            </div>
            <Sidebar />
        </div>
    )
}

export default Home;