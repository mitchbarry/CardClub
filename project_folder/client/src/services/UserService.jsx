import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000/api/users",
})

const UserService = {
    async getOneUser(id) {
        return http.get(`/users/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw error;
            })
    },
    async updateOneUser(user) {
        return http.put(`/users/${user._id}`, user)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
    },
    async deleteOneUser(id) {
        return http.delete(`/users/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
    }
}

export default UserService;