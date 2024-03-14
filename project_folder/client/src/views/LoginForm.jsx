import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import authService from "../services/AuthService";
import Sidebar from "../components/Sidebar";

import styles from "../css/views/LoginForm.module.css";

const LoginForm = (props) => {

    const navigate = useNavigate()

    const {responseLoginHandler} = props

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    const [formErrors, setFormErrors] = useState({
        email: "Email is required!",
        password: "Password is required!"
    })
    const [initialRender, setInitialRender] = useState({
        email: true,
        password: true
    })

    const inputHandler = (e) => {
        switch(e.target.id) {
            case "email":
                return emailHandler(e);
            case "password":
                return passwordHandler(e);
            default:
                return;
        }
    };

    const emailHandler = (e) => {
        setEmail(e.target.value)
        setInitialRender({...initialRender, email: false})
        const value = e.target.value.trim()
        let errorMsg = ""
        if (!value) {
            errorMsg = "Email is required!"
        }
        setFormErrors({...formErrors, email: errorMsg})
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value)
        setInitialRender({...initialRender, password: false})
        const value = e.target.value.trim()
        let errorMsg = ""
        if (!value) {
            errorMsg = "Password is required!"
        }
        setFormErrors({...formErrors, name: errorMsg})
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login({
                email,
                password
            });
            responseLoginHandler(response.data);
            navigate("/dashboard");
        }
        catch (error) {
            if (error.response) { // Handle login error
                setErrors([...errors, error.response.data.message]); // If server returns an error response
            } else {
                console.error("Registration failed:", error); // If there's a network error or other unexpected error
                setErrors([...errors, "An unexpected error occurred. Please try again later."]);
            }
        }
    };

    const closeNotification = () => {
        setShowNotification(false);
    }

    return (
        <div>
            <Sidebar />
            {(errors.validationErrors && errors.validationErrors.length !== 0 && showNotification) && (
                <ul className={styles.flashBox}>
                    <button className={styles.closeButtonRed} onClick={() => closeNotification()}>x</button>
                    <li className={styles.flashBoxLi}>
                        {errors.name} {errors.statusCode}
                    </li>
                    {errors.validationErrors.map((error, index) => (
                        <li key={index} className={styles.flashBoxLi}>{error}</li>
                    ))}
                </ul>
            )}
            <form className={styles.flexForm} onSubmit={submitHandler}>
                <label htmlFor="email" className={styles.whiteLabel}>Email:</label>
                <input className={formErrors.email && !initialRender.email ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="email" name="email" value={email} onChange={(e) => inputHandler(e)}></input>
                {formErrors.email && !initialRender.email && (
                    <p className={styles.paragraphError}>{formErrors.email}</p>
                )}
                <label htmlFor="password" className={styles.whiteLabel}>Password:</label>
                <input className={formErrors.password && !initialRender.password ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="password" name="password" value={password} onChange={(e) => inputHandler(e)}></input>
                {formErrors.password && !initialRender.password && (
                    <p className={styles.paragraphError}>{formErrors.password}</p>
                )}
                <button className={styles.blueButton} type="submit">
                    Login
                </button>
            </form>
            <Sidebar />
        </div>
    );
};

export default LoginForm;