import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000/api/auth",
})

const AuthService = {
    async login() {
        return http.post("/register")
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    async register() {
        return http.post(`/login`)
            .then(response => response.data)
            .catch(error => {
                throw error;
            })
    },
    async logout() {
        return http.post("/logout")
            .then(response => response.data)
            .catch(error => {
                throw error;
            })
    }
}

export default AuthService;