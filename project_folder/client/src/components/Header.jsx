import { Link } from "react-router-dom";

import pokerTime from "../assets/pokerLogo.png"
import styles from "../css/Header.module.css";

const Header = () => {

    return (
        <div className={styles.header}>
            <div className={styles.headerMain}>
                <div className={styles.flexBox}>
                    <img src={pokerTime} alt="Poker Time Logo" className={styles.logo} />
                    <h1 className={styles.heading1}>
                        <span className={styles.whiteText}>
                            Poker Time Project
                        </span>
                    </h1>
                </div>
                <div className={styles.flexBox}>
                    <Link className={styles.yellowButton}>About</Link>
                    <button className={styles.redButtonMarginLeft}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Header;