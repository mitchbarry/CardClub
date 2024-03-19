import { Link,useLocation } from "react-router-dom";

import pokerTime from "../assets/pokerLogo.png"
import styles from "../css/components/Header.module.css";

const Header = (props) => {

    const location = useLocation()

    const {token, user, logoutHandler} = props

    return (
        <div className={styles.header}>
            <div className={styles.headerMain}>
                <Link to={token ? "/dashboard" : "/"} className={styles.flexBox}>
                    <img src={pokerTime} alt="Poker Time Logo" className={styles.logo} />
                    <h1 className={styles.heading1}>
                        <span className={styles.whiteText}>
                            Card Club
                        </span>
                    </h1>
                </Link>
                {token ? (
                    <div className={styles.flexBox}>
                        {user && user.username && (
                            <h4>
                                Logged in as {user.username}
                            </h4>
                        )}
                        <Link to="/account" className={styles.yellowButton}>ACCOUNT</Link>
                        <button onClick={logoutHandler} className={styles.redButtonMarginLeft}>LOGOUT</button>
                    </div>
                ) : (
                    <>
                        {location.pathname.toLowerCase() === "/" && (
                            <div className={styles.flexBox}>
                                <Link to="/login" className={styles.yellowButton}>LOG IN</Link>
                                <Link to="/register" className={styles.redButtonMarginLeft}>SIGN UP</Link>
                            </div>
                        )}
                        {location.pathname.toLowerCase() === "/login" && (
                            <Link to="/register" className={styles.redButtonMarginLeft}>SIGN UP</Link>
                        )}
                        {location.pathname.toLowerCase() === "/register" && (
                            <Link to="/login" className={styles.yellowButton}>LOG IN</Link>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Header;