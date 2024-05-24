import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import styles from "../css/views/Error.module.css";

const Error = (props) => {

    const {errors, token} = props

    return (
        <div className={styles.flexBox}>
            <Sidebar />
            <div className={styles.mainItem}>
                {Object.keys(errors).length !== 0 && (
                    <>
                        {errors.statusCode && errors.name && (
                            <h2 className={styles.heading2}>
                                Error {errors.statusCode}: {errors.name} 
                            </h2>
                        )}
                        {errors.message && (
                            <li className={styles.flashBoxLi}>
                                {errors.message}
                            </li>
                        )}
                        {errors.validationErrors && errors.validationErrors.length !== 0 && (
                            Object.keys(errors.validationErrors).map((key, index) => (
                                <li key={index} className={styles.flashBoxLi}>
                                    {errors.validationErrors[key]}
                                </li>
                            ))
                        )}
                    </>
                )}
                {token ? (
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