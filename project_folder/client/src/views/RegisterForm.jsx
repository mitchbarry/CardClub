import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/AuthService";

import styles from "../css/views/RegisterForm.module.css";

const RegisterForm = () => {

    const navigate = useNavigate()

    const inputs = ["username", "email", "password", "confirmPassword", "birthDate"]

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [errors, setErrors] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    const [formErrors, setFormErrors] = useState({
        username: "Username is required!",
        email: "Email is required!",
        password: "Password is required!",
        confirmPassword: "Confirm password is required!",
        birthDate: "Birthday is required!"
    })
    const [initialRender, setInitialRender] = useState({
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
        birthDate: true
    })

    const inputHandler = (e) => {
        switch(e.target.id) {
            case "username":
                return usernameHandler(e);
            case "email":
                return emailHandler(e);
            case "password":
                return passwordHandler(e);
            case "confirmPassword":
                return confirmPasswordHandler(e);
            case "birthDate":
                return birthDateHandler(e);
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

    const submitHandler = (e) => {
        e.preventDefault();
        if (validateForm) {
            authService.register({
                username,
                email,
                password,
                birthDate
            })
            .then(response => {
                console.log(response)
                navigate("/dashboard")
            })
            .catch(error => {
                setErrors(error.response.data)
                setShowNotification(true)
            })
        }
    }

    const validateForm = () => {
        return Object.values(formErrors).every(key => formErrors[key] === "")
    }

    const closeNotification = () => {
        setShowNotification(false);
    }

    return (
        <div>
            {(errors.validationErrors && errors.validationErrors.length !== 0 && showNotification) && (
                <ul className={styles.flashBox}>
                    <button className={styles.closeButtonRed} onClick={() => closeNotification()}>x</button>
                    <li className={styles.flashBoxLi}>
                        {errors.name} {errors.statusCode}
                    </li>
                    {inputs.map((input, index) => (
                        errors.validationErrors[input] && (
                            <li key={index} className={styles.flashBoxLi}>{errors.validationErrors[input]}</li>
                        )
                    ))}
                </ul>
            )}
            <form className={styles.flexForm} onSubmit={submitHandler}>
                <div className={styles.flexFormColumn}>
                    <label htmlFor="name" className={styles.whiteLabel}>Dish Name:</label>
                    <input className={formErrors.name && !initialRender.name ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="name" name="name" value={name} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.name && !initialRender.name && (
                        <p className={styles.paragraphError}>{formErrors.name}</p>
                    )}
                    <label htmlFor="minutes" className={styles.whiteLabel}>Total Minutes:</label>
                    <input className={formErrors.minutes && !initialRender.minutes ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="number" id="minutes" name="minutes" value={minutes} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.minutes && !initialRender.minutes && (
                        <p className={styles.paragraphError}>{formErrors.minutes}</p>
                    )}
                    <label htmlFor="directions" className={styles.whiteLabel}>Directions:</label>
                    <input className={formErrors.directions && !initialRender.directions ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="directions" name="directions" value={directions} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.directions && !initialRender.directions && (
                        <p className={styles.paragraphError}>{formErrors.directions}</p>
                    )}
                    <label htmlFor="directions" className={styles.whiteLabel}>Directions:</label>
                    <input className={formErrors.directions && !initialRender.directions ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="directions" name="directions" value={directions} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.directions && !initialRender.directions && (
                        <p className={styles.paragraphError}>{formErrors.directions}</p>
                    )}
                    <label htmlFor="directions" className={styles.whiteLabel}>Directions:</label>
                    <input className={formErrors.directions && !initialRender.directions ? styles.textfieldRedOutline : styles.textfieldMarginBottom} type="text" id="directions" name="directions" value={directions} onChange={(e) => inputHandler(e)}></input>
                    {formErrors.directions && !initialRender.directions && (
                        <p className={styles.paragraphError}>{formErrors.directions}</p>
                    )}
                    <button className={validateForm() ? styles.blueButton : styles.blueButtonDisabled} type="submit" disabled={!validateForm()}>
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;