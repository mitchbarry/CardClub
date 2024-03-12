import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000/api/lobbies",
})

const LobbyService = {
    async getAllLobbies() {
        return http.get("/lobbies")
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    async getOneLobby(id) {
        return http.get(`/lobbies/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw error;
            })
    },
    async createOneLobby(meal) {
        return http.post("/lobbies", meal)
            .then(response => response.data)
            .catch(error => {
                throw error;
            })
    },
    async updateOneLobby(meal) {
        return http.put(`/lobbies/${meal._id}`, meal)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
    },
    async deleteOneLobby(id) {
        return http.delete(`/lobbies/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
    }
}

export default LobbyService;