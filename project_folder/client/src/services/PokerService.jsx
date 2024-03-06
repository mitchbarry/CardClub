import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8000/api",
})

const PokerService = {
    async getAllMeals() {
        return http.get("/meals")
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    async getOneMeal(id) {
        return http.get(`/meals/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw error;
            })
    },
    async createOneMeal(meal) {
        return http.post("/meals", meal)
            .then(response => response.data)
            .catch(error => {
                throw error;
            })
    },
    async updateOneMeal(meal) {
        return http.put(`/meals/${meal._id}`, meal)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
    },
    async deleteOneMeal(id) {
        return http.delete(`/meals/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw error
            })
    },
    async getMealsUnder60Minutes() {
        return http.get("/meals/under60")
            .then(response => response.data)
            .catch(error => {
                throw error
            })
    },
    async getMealsUnder120Minutes() {
        return http.get("/meals/under120")
            .then(response => response.data)
            .catch(error => {
                throw error
            })
    },
    async getMealsWithThreeIngredients() {
        return http.get("/meals/withThreeIngredients")
            .then(response => response.data)
            .catch(error => {
                throw error
            })
    },
    pathValidator(path) {
        const pathSegments = path.split('/');
        const category = pathSegments[1];
        const id = pathSegments[2];
        const page = pathSegments[3];
        const isValidCategory = category === "meals"
        const isValidId = (id) => {
            const objectIdPattern = /^[0-9a-fA-F]{24}$/;
            return objectIdPattern.test(id);
        }
        const isValidPage = page !== undefined && (page === "edit" || page === "details");
        return isValidCategory && isValidId(id) && (isValidPage || page === undefined);
    }
}

export default PokerService;