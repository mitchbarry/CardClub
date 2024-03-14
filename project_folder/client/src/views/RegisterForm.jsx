import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/AuthService";
import Sidebar from "../components/Sidebar";

import styles from "../css/views/RegisterForm.module.css";

const RegisterForm = (props) => {

    const navigate = useNavigate()

    const {responseLoginHandler} = props

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    const [formErrors, setFormErrors] = useState({
        username: "Username is required!",
        email: "Email is required!",
        birthDate: "Birthday is required!",
        password: "Password is required!",
        confirmPassword: "Confirm password is required!"
    })
    const [initialRender, setInitialRender] = useState({
        username: true,
        email: true,
        birthDate: true,
        password: true,
        confirmPassword: true
    })

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
        setUsername(e.target.value)
        setInitialRender({...initialRender, username: false})
        const value = e.target.value.trim()
        let errorMsg = ""
        if (value) {
            if (value.length < 4) {
                errorMsg = "Username must be at least 4 characters long!"
            }
            else if (value.length > 25) {
                errorMsg = "Username must be less than 25 characters long"
            }
        }
        else {
            errorMsg = "Username is required!"
        }
        setFormErrors({...formErrors, name: errorMsg})
    }

    const emailHandler = (e) => {
        setEmail(e.target.value)
        setInitialRender({...initialRender, email: false})
        const value = e.target.value.trim()
        let errorMsg = ""
        if (value) {
            if (value.length < 6) {
                errorMsg = "Email must be at least 6 characters long!"
            }
            else if (value.length > 25) {
                errorMsg = "Email must be less than 255 characters long"
            }
        }
        else {
            errorMsg = "Email is required!"
        }
        setFormErrors({...formErrors, email: errorMsg})
    }

    const birthDateHandler = (e) => {
        setBirthDate(e.target.value)
        setInitialRender({...initialRender, birthDate: false})
        let errorMsg = ""
        let value = e.target.value
        if (!value) {
            errorMsg = "Birthday is required!"
        }
        setFormErrors({...formErrors, birthDate: errorMsg})
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value)
        setInitialRender({...initialRender, password: false})
        const value = e.target.value.trim()
        let errorMsg = ""
        if (value) {
            if (value.length < 6) {
                errorMsg = "Password must be at least 6 characters long!"
            }
            else if (value.length > 255) {
                errorMsg = "Password must be less than 255 characters long"
            }
        }
        else {
            errorMsg = "Password is required!"
        }
        setFormErrors({...formErrors, name: errorMsg})
    }

    const confirmPasswordHandler = (e) => {
        setConfirmPassword(e.target.value)
        setInitialRender({...initialRender, confirmPassword: false})
        const value = e.target.value.trim()
        let errorMsg = ""
        if (value) {
            if (value !== password) {
                errorMsg = "Passwords must match!"
            }
        }
        else {
            errorMsg = "Confirm password is required!"
        }
        setFormErrors({...formErrors, confirmPassword: errorMsg})
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await authService.register({
                    username,
                    email,
                    password,
                    birthDate
                });
                responseLoginHandler(response.data);
                navigate("/dashboard");
            }
            catch (error) {
                if (error.response) { // Handle registration error
                    setErrors([...errors, error.response.data.message]); // If server returns an error response
                } else {
                    console.error("Registration failed:", error); // If there's a network error or other unexpected error
                    setErrors([...errors, "An unexpected error occurred. Please try again later."]);
                }
            }
        }
    };

    const validateForm = () => {
        return Object.values(formErrors).every(key => formErrors[key] === "")
    }

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
                <label htmlFor="username" className={styles.whiteLabel}>Username:</label>
                <input className={formErrors.username && !initialRender.username ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="username" name="username" value={username} onChange={(e) => inputHandler(e)}></input>
                {formErrors.username && !initialRender.username && (
                    <p className={styles.paragraphError}>{formErrors.username}</p>
                )}
                <label htmlFor="email" className={styles.whiteLabel}>Email:</label>
                <input className={formErrors.email && !initialRender.email ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="email" name="email" value={email} onChange={(e) => inputHandler(e)}></input>
                {formErrors.email && !initialRender.email && (
                    <p className={styles.paragraphError}>{formErrors.email}</p>
                )}
                <label htmlFor="birthDate" className={styles.whiteLabel}>Birthday:</label>
                <input className={formErrors.birthDate && !initialRender.birthDate ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="date" id="birthDate" name="birthDate" value={birthDate} onChange={(e) => inputHandler(e)}></input>
                {formErrors.birthDate && !initialRender.birthDate && (
                    <p className={styles.paragraphError}>{formErrors.birthDate}</p>
                )}
                <label htmlFor="password" className={styles.whiteLabel}>Password:</label>
                <input className={formErrors.password && !initialRender.password ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="password" name="password" value={password} onChange={(e) => inputHandler(e)}></input>
                {formErrors.password && !initialRender.password && (
                    <p className={styles.paragraphError}>{formErrors.password}</p>
                )}
                <label htmlFor="confirmPassword" className={styles.whiteLabel}>Confirm Password:</label>
                <input className={formErrors.confirmPassword && !initialRender.confirmPassword ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => inputHandler(e)}></input>
                {formErrors.confirmPassword && !initialRender.confirmPassword && (
                    <p className={styles.paragraphError}>{formErrors.confirmPassword}</p>
                )}
                <button className={validateForm() ? styles.blueButton : styles.blueButtonDisabled} type="submit" disabled={!validateForm()}>
                    Register
                </button>
            </form>
            <Sidebar />
        </div>
    );
}

export default RegisterForm;