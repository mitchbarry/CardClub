import Sidebar from "../components/Sidebar";
import Poker from "../components/Poker";

import styles from "../css/views/Play.module.css";

const Play = () => {

    return (
        <div className={styles.flexBox}>
            <Sidebar />
            <Poker />
            <Sidebar />
        </div>
    )
}

export default Play;