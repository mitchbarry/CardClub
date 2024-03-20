import { Link } from "react-router-dom";

import linkedIn from "../assets/linkedIn256.png"
import gitHub from "../assets/gitHub256White.png"
import styles from "../css/components/Footer.module.css";

const Footer = () => {

    const openLink = (link) => {
        window.open(link, "_blank");
    }

    return (
        <div className={styles.footer}>
            <div className={styles.footerMain}>
                <div className={styles.flexBox}>
                    <Link className={styles.whiteText}>
                        <h4 className={styles.heading4MarginRight}>
                            About
                        </h4>
                    </Link>
                    <Link className={styles.whiteText}>
                        <h4 className={styles.heading4MarginRight}>
                            Changelog
                        </h4>
                    </Link>
                    <Link className={styles.whiteText}>
                        <h4 className={styles.heading4}>
                            Contact
                        </h4>
                    </Link>
                </div>
                <div className={styles.flexBox}>
                    <h5 className={styles.heading5MarginRight}>
                        <span className={styles.whiteText}>
                            Mitch Barry
                        </span>
                    </h5>
                    <button className={styles.logoIcon} onClick={() => openLink("https://github.com/mitchbarry")}>
                        <img src={gitHub} alt="GitHub Logo" className={styles.logoIcon} />
                    </button>
                    <button className={styles.logoIcon} onClick={() => openLink("https://www.linkedin.com/in/mitch-barry/")}>
                        <img src={linkedIn} alt="LinkedIn Logo" className={styles.logoIconMarginRight} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Footer;