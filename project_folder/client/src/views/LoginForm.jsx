import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import authService from "../services/AuthService";

import styles from "../css/LoginForm.module.css";

const LoginForm = (props) => {

    const navigate = useNavigate()

    const {loginHandler} = props

    const inputs = ["email", "password"]

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
                loginHandler(response.data);
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
        </div>
        <div className={styles.container}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;