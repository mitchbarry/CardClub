import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import styles from "../css/views/Error.module.css";

const Error = (props) => {

    const {error, token} = props

    return (
        <div>
            <Sidebar />
            <div className={styles.mainItem}>
                <h2 className={styles.heading2}>
                    Error {error.statusCode}: {error.message}
                </h2>
                {token === "" ? (
                    <Link to="/home" className={styles.blueButton}>Home</Link>
                ) : (
                    <Link to="/dashboard" className={styles.blueButton}>Dashboard</Link>
                )}
            </div>
            <Sidebar />
        </div>
    );
}

export default Error;