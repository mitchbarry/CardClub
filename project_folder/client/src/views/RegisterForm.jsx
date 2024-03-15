import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/AuthService";
import Sidebar from "../components/Sidebar";

import styles from "../css/views/RegisterForm.module.css";

const RegisterForm = (props) => {

    const navigate = useNavigate()

    const {responseLoginHandler, intendedRoute, intendedRouteHandler} = props

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    const [formErrors, setFormErrors] = useState({
        username: "",
        email: "",
        birthDate: "",
        password: "",
        confirmPassword: ""
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

    /*
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
    */

    const usernameHandler = (e) => {
        setUsername(e.target.value.trim())
        setFormErrors({...formErrors, username: ""});
    }

    const emailHandler = (e) => {
        setEmail(e.target.value.trim())
        setFormErrors({...formErrors, email: ""});
    }

    const birthDateHandler = (e) => {
        setBirthDate(e.target.value.trim())
        setFormErrors({...formErrors, birthDate: ""});
    }

    const passwordHandler = (e) => {
        const newValue = e.target.value.trim();
        setPassword(newValue);
        checkConfirmPassword(newValue, confirmPassword); // Pass the new value
        setFormErrors({...formErrors, password: ""});
    }
    
    const confirmPasswordHandler = (e) => {
        const newValue = e.target.value.trim();
        setConfirmPassword(newValue);
        checkConfirmPassword(password, newValue); // Pass the new value
    }
    
    const checkConfirmPassword = (newPassword, newConfirmPassword) => {
        let errorMsg = "";
        if (newConfirmPassword !== "" && newConfirmPassword !== newPassword) {
            errorMsg = "Passwords must match!";
        }
        setFormErrors({...formErrors, confirmPassword: errorMsg});
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
                if (intendedRoute) { // This bit might need testing due to nature of state !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    navigate(intendedRoute);
                    intendedRouteHandler("");
                }
                else {
                    navigate("/dashboard");
                }
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
        <div className={styles.flexBox}>
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
                <input className={formErrors.password ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="password" name="password" value={password} onChange={(e) => inputHandler(e)}></input>
                {formErrors.password && (
                    <p className={styles.paragraphError}>{formErrors.password}</p>
                )}
                <label htmlFor="confirmPassword" className={styles.whiteLabel}>Confirm Password:</label>
                <input className={formErrors.confirmPassword ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => inputHandler(e)}></input>
                {formErrors.confirmPassword && (
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