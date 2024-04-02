import { useState } from 'react';

import authService from "../services/AuthService";
import Sidebar from "../components/Sidebar";

import styles from "../css/views/LoginForm.module.css";

const LoginForm = (props) => {

    const {responseLoginHandler} = props

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    const [formErrors, setFormErrors] = useState({
        email: "",
        password: ""
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
        const value = e.target.value;
        setFormErrors((prevErrors) => {
            switch (prevErrors.email) {
                case "Email is required!":
                case "Please enter a valid email!":
                    if (value) {
                        return{...prevErrors, email: ""};
                    }
                    break;
                default:
                    return prevErrors;
            }
        })
        setEmail(value);
    }

    const passwordHandler = (e) => {
        const value = e.target.value;
        setFormErrors((prevErrors) => {
            switch (prevErrors.password) {
                case "Password is required!":
                    if (value) {
                        return {...prevErrors, password: ""};
                    }
                    break;
                default:
                    return prevErrors;
            }
        })
        setPassword(value);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        checkForm();
    };

    const checkForm = () => {
        const newFormErrors = {...formErrors}
        if (!email.trim()) { // checks email on submit
            newFormErrors.email = "Email is required!"
        }
        else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            newFormErrors.email = "Please enter a valid email!"
        }
        if (!password.trim()) { // checks password on submit
            newFormErrors.password = "Password is required!"
        }
        if (Object.keys(newFormErrors).every(key => newFormErrors[key] === "")) {
            sendRequest();
        }
        else {
            setFormErrors(prevErrors => ({...prevErrors, ...newFormErrors}));
        }
    }

    const sendRequest = async () => {
        try {
            const response = await authService.login({
                email: email.trim(),
                password: password.trim()
            });
            responseLoginHandler(response);
        }
        catch (error) {
            console.log(error)
            if (error.response) { // Handle registration error if server returns an error response
                setErrors(error.response.data)
            }
            else if (error.request) { // Handle network errors
                const normalizedError = {
                    statusCode: 500, // Assuming a generic status code for network errors
                    message: "A network error occurred. Please check your internet connection and try again.",
                    name: "NetworkError",
                    validationErrors: {}
                };
                setErrors(normalizedError)
            }
            else { // Handle unexpected errors
                const normalizedError = {
                    statusCode: 500, // Assuming a generic status code for unexpected errors
                    message: "An unexpected error occurred. Please try again later.",
                    name: "UnexpectedError",
                    validationErrors: {}
                };
                setErrors(normalizedError)
            }
            setShowNotification(true);
        }
    }

    const closeNotification = () => {
        setShowNotification(false);
    }

    return (
        <div className={styles.flexBox}>
            <Sidebar />
            <div>
                {(Object.keys(errors).length !== 0  && showNotification) && (
                    <ul className={styles.flashBox}>
                        <button className={styles.closeButtonRed} onClick={() => closeNotification()}>x</button>
                        {errors.statusCode && errors.name && (
                            <li className={styles.flashBoxLi}>
                                Error {errors.statusCode}: {errors.name} 
                            </li>
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
                    </ul>
                )}
                <form className={styles.flexForm} onSubmit={submitHandler}>
                    <label htmlFor="email" className={styles.whiteLabel}>Email:</label>
                    <input className={formErrors.email ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="email" name="email" value={email} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.email && (
                        <p className={styles.paragraphError}>{formErrors.email}</p>
                    )}
                    <label htmlFor="password" className={styles.whiteLabel}>Password:</label>
                    <input className={formErrors.password ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="password" id="password" name="password" value={password} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.password && (
                        <p className={styles.paragraphError}>{formErrors.password}</p>
                    )}
                    <button className={styles.blueButton} type="submit">
                        Login
                    </button>
                </form>
            </div>
            <Sidebar />
        </div>
    );
};

export default LoginForm;