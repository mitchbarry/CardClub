import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000/api/auth",
})

const AuthService = {
    async register(user) {
        return http.post("/register", user)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    async login(user) {
        return http.post(`/login`, user)
            .then(response => response.data)
            .catch(error => {
                throw error;
            })
    },
    async logout(/* token*/) {
        /* commented bits may be used to write a token blacklist
        const config = {
            headers: {
                Authorization: `Bearer ${token}` // Include the token in the Authorization header
            }
        };
        */
        return http.post("/logout"/* , null, config*/) // Assuming the endpoint for logout is '/logout'
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    async getUserInfo(token) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}` // Include the token in the Authorization header
            }
        };
        return http.get("/user", config) // Assuming the endpoint for getting user info is '/user'
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }
}

export default AuthService;