import User from '../models/user.model.js';

const userController = {
    async getAllUsers(req, res, next) {
        try {
            const allUsers = await User.find();
            res.json(allUsers);
        }
        catch (error) {
            next(error)
        }
    },
    async getOneUser(req, res, next) {
        try {
            const {_id} = req.body;
            const foundUser = await User.findById(_id);
            res.json(foundUser);
        }
        catch (error) {
            next(error)
        }
    },
    async updateOneUser(req, res, next) {
        const {_id} = req.body;
        const options = {
            new: true,
            runValidators: true,
        };
        try {
            const updatedUser = await User.findByIdAndUpdate(_id, req.body, options);
            res.json(updatedUser);
        }
        catch (error) {
            next(error)
        }
    },
    async deleteOneUser(req, res, next) {
        const {_id} = req.body;
        try {
            const deletedUser = await User.findByIdAndDelete(_id);
            res.json(deletedUser);
        }
        catch (error) {
            next(error)
        }
    }
};

export default userController;