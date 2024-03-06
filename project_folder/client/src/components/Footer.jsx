import { Link } from "react-router-dom";

import linkedInLogo from "../assets/linkedInLogo.png"
import gitHubLogo from "../assets/gitHubLogo.png"
import styles from "../css/Footer.module.css";

const Footer = () => {

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
                    <Link>
                        <img src={gitHubLogo} alt="GitHub Logo" className={styles.logoIcon} />
                    </Link>
                    <Link>
                        <img src={linkedInLogo} alt="LinkedIn Logo" className={styles.logoIconMarginRight} />
                    </Link>
                    <h5 className={styles.heading5MarginRight}>
                        <span className={styles.whiteText}>
                            Gabe Oxner
                        </span>
                    </h5>
                    <Link>
                        <img src={gitHubLogo} alt="GitHub Logo" className={styles.logoIcon} />
                    </Link>
                    <Link>
                        <img src={linkedInLogo} alt="LinkedIn Logo" className={styles.logoIcon} />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Footer;