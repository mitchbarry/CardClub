import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "../css/views/Account.module.css";

const Account = (props) => {

    const {user} = props

    const [areYouSure, setAreYouSure] = useState(false);

    const deleteAccount = () => {
        if (areYouSure) {
            
        }
    }

    return (
        <div>
            <h1>
                hey heres some info about your account
            </h1>
            <Link to="/account/edit">Edit Account</Link>
            <button onClick={deleteAccount}></button>
        </div>
    )
}

export default Account;