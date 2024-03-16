import { useEffect, useState } from "react";

import authService from "../services/AuthService";
import Sidebar from "../components/Sidebar";

import styles from "../css/views/RegisterForm.module.css";

const RegisterForm = (props) => {

    const {responseLoginHandler} = props

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [showNotification, setShowNotification] = useState(false)
    const [formErrors, setFormErrors] = useState({
        username: "",
        email: "",
        birthDate: "",
        password: "",
        confirmPassword: ""
    })
    const [isValidForm, setIsValidForm] = useState(true);

    const inputHandler = (e) => {
        switch(e.target.id) {
            case "username":
                return usernameHandler(e);
            case "email":
                return emailHandler(e);
            case "birthDate":
                return birthDateHandler(e);
            case "password":
                return passwordHandler(e);
            case "confirmPassword":
                return confirmPasswordHandler(e);
            default:
                return;
        }
    };

    const usernameHandler = (e) => {
        const value = e.target.value;
        setFormErrors((prevErrors) => {
            switch (prevErrors.username) {
                case "Username is required!":
                    if (value) {
                        return {...prevErrors, username: ""};
                    }
                    break;
                case "Username must be at least 4 characters long!":
                    if (value.length > 4) {
                        return {...prevErrors, username: ""};
                    }
                    break;
                case "Username must be less than 25 characters long!":
                    if (value.length < 25) {
                        return {...prevErrors, username: ""};
                    }
                    break;
                default:
                    return prevErrors;
            }
        })
        setUsername(value)
    }

    const emailHandler = (e) => {
        const value = e.target.value;
        setFormErrors((prevErrors) => {
            switch (prevErrors.email) {
                case "Email is required!":
                    if (value) {
                        return{...prevErrors, email: ""};
                    }
                    break;
                case "Email must be at least 6 characters long!":
                    if (value.length > 6) {
                        return{...prevErrors, email: ""};
                    }
                    break;
                case "Email must be less than 255 characters long!":
                    if (value.length < 255) {
                        return{...prevErrors, email: ""};
                    }
                    break;
                case "Please enter a valid email!":
                    if (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
                        return{...prevErrors, email: ""};
                    }
                    break;
                default:
                    return prevErrors;
            }
        })
        setEmail(value);
    }

    const birthDateHandler = (e) => {
        const value = e.target.value;
        const today = new Date();
        const userDate = new Date(value);
        setFormErrors((prevErrors) => {
            switch (prevErrors.birthDate) {
                case "Birthday is required!":
                    if (value) {
                        return{...prevErrors, birthDate: ""};
                    }
                    break;
                case "Please enter a valid birthday!":
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1); // Set the date to yesterday
                    if (userDate.getTime() < yesterday.getTime()) {
                        return{...prevErrors, birthDate: ""};
                    }
                    break;
                case "You must be at least 18 years old!":
                    const age = today.getFullYear() - userDate.getFullYear(); // Calculate age
                    if (age >= 18) { // Check if the user is at least 18 years old
                        return{...prevErrors, birthDate: ""};
                    }
                    break;
                default:
                    return prevErrors;
            }
        })
        setBirthDate(value);
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
                case "Password must be at least 6 characters long!":
                    if (value.length > 6) {
                        return {...prevErrors, password: ""};
                    }
                    break;
                case "Password must be less than 255 characters long!":
                    if (value.length > 255) {
                        return {...prevErrors, password: ""};
                    }
                // Optional regex Case here to verify the user password has certain characters or a certain uppercase characters
                default:
                    return prevErrors;
            }
        })
        setPassword(value);
        checkPasswordMatch(value, confirmPassword); // Pass the new value
    }
    
    const confirmPasswordHandler = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        checkPasswordMatch(password, value); // Pass the new value
    }
    
    const checkPasswordMatch = (newPassword, newConfirmPassword) => {
        let errorMsg = "";
        if (newConfirmPassword !== newPassword) {
            errorMsg = "Passwords must match!";
        }
        setFormErrors(prevErrors => ({...prevErrors, confirmPassword: errorMsg}));
    }

    const submitHandler = (e) => {
        e.preventDefault();
        checkForm();
    };

    const checkForm = () => {
        const today = new Date();
        const userDate = new Date(birthDate);
        const newFormErrors = {...formErrors}
        if (!username.trim()) { // checks username on submit
            newFormErrors.username = "Username is required!"
        }
        else if (username.trim().length < 4) {
            newFormErrors.username = "Username must be at least 4 characters long!"
        }
        else if (username.trim().length > 25) {
            newFormErrors.username = "Username must be less than 25 characters long!"
        }
        if (!email.trim()) { // checks email on submit
            newFormErrors.email = "Email is required!"
        }
        else if (email.trim().length < 6) {
            newFormErrors.email = "Email must be at least 6 characters long!"
        }
        else if (email.trim().length > 255) {
            newFormErrors.email = "Email must be less than 255 characters long!"
        }
        else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            newFormErrors.email = "Please enter a valid email!"
        }
        if (!birthDate.trim()) { // checks birthDate on submit
            newFormErrors.birthDate = "Birthday is required!"
        }
        else {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            if (userDate.getTime() > yesterday.getTime()) {
                newFormErrors.birthDate = "Please enter a valid birthday!"
            }
            else {
                const age = today.getFullYear() - userDate.getFullYear(); // Calculate age
                if (age <= 18) {
                    newFormErrors.birthDate = "You must be at least 18 years old!"
                }
            }
        }
        if (!password.trim()) { // checks password on submit
            newFormErrors.password = "Password is required!"
        }
        else if (password.trim().length < 6) {
            newFormErrors.password = "Password must be at least 6 characters long!"
        }
        else if (password.trim().length > 255) {
            newFormErrors.password = "Password must be less than 255 characters long!"
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
            const response = await authService.register({
                username: username.trim(),
                email: email.trim(),
                birthDate: birthDate.trim(),
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

    useEffect(() => {
        const areErrorsResolved = Object.keys(formErrors).every(key => formErrors[key] === "")
        setIsValidForm(areErrorsResolved);
    }, [formErrors, username, email, birthDate, password, confirmPassword])

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
                    <label htmlFor="username" className={styles.whiteLabel}>Username:</label>
                    <input className={formErrors.username ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="username" name="username" value={username} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.username && (
                        <p className={styles.paragraphError}>{formErrors.username}</p>
                    )}
                    <label htmlFor="email" className={styles.whiteLabel}>Email:</label>
                    <input className={formErrors.email ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="email" name="email" value={email} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.email && (
                        <p className={styles.paragraphError}>{formErrors.email}</p>
                    )}
                    <label htmlFor="birthDate" className={styles.whiteLabel}>Birthday:</label>
                    <input className={formErrors.birthDate ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="date" id="birthDate" name="birthDate" value={birthDate} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.birthDate && (
                        <p className={styles.paragraphError}>{formErrors.birthDate}</p>
                    )}
                    <label htmlFor="password" className={styles.whiteLabel}>Password:</label>
                    <input className={formErrors.password ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="password" id="password" name="password" value={password} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.password && (
                        <p className={styles.paragraphError}>{formErrors.password}</p>
                    )}
                    <label htmlFor="confirmPassword" className={styles.whiteLabel}>Confirm Password:</label>
                    <input className={formErrors.confirmPassword ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.confirmPassword && (
                        <p className={styles.paragraphError}>{formErrors.confirmPassword}</p>
                    )}
                    <button className={isValidForm ? styles.blueButton : styles.blueButtonDisabled} type="submit" disabled={!isValidForm}>
                        Register
                    </button>
                </form>
            </div>
            <Sidebar />
        </div>
    );
}

export default RegisterForm;