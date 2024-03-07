import styles from "../css/MainContent.module.css";
import Sidebar from "../components/Sidebar";
import Poker from "../views/Poker";

const MainContent = () => {

    return (
        <div className={styles.mainContent}>
            <Sidebar />
            <Poker />
            <Sidebar />
        </div>
    )
}

export default MainContent;