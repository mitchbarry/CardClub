const CardClubService = {
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

export default CardClubService;