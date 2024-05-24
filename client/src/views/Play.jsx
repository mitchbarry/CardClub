import { useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import PokerOnline from "../components/PokerOnline";
import Poker from "../components/Poker";

import styles from "../css/views/Play.module.css";

const Play = (props) => {

    const {user} = props;
    const {id} = useParams(); // Extracting the id parameter from the URL

    return (
        <div className={styles.flexBox}>
            <Sidebar />
            {id ? <PokerOnline user={user}/> : <Poker />}
            <Sidebar />
        </div>
    )
}

export default Play;