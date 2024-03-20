import { Link } from "react-router-dom";

import styles from "../css/views/Dashboard.module.css";

const Dashboard = (props) => {

    const {user} = props

    return (
        <div className={styles.mainItem}> 
            <h1>
                Dashboard
            </h1>
            <h2>
                Here's some cool relevant info about you
            </h2>
            <ul>
                <li>
                    friend 1
                </li>
                <li>
                    friend 2??
                </li>
            </ul>
            <Link to="/play" className={styles.blueButton}>Play Now</Link>
            <Link to="/lobbies" className={styles.blueButton}>Browse Lobbies</Link>
        </div>
    )
}

export default Dashboard;