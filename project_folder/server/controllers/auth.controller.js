import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user.model.js';

const authController = {
    generateAuthToken(user) {
        return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    },
    async registerUser(req, res, next) {
        try {
            const { userName, email, password, birthDate } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                userName,
                email,
                password: hashedPassword,
                birthDate
            });
            const token = generateAuthToken(newUser);
            res.json({ newUser, token });
        }
        catch (error) {
            next(error);
        }
    },
    async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.getOneUser({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const token = generateAuthToken(user);
            res.json({ user, token });
        }
        catch (error) {
            next(error);
        }
    },
    async logoutUser(req, res, next) {
        try {
            res.json({ message: "Logout successful" });
        }
        catch (error) {
            next(error);
        }
    },
    async getUserInfo(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1]; // Extract the token from the request headers
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decodedToken.userId); // Retrieve user information associated with the token
            if (!user) { // Check if user exists
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user); // Send the user information as a response
        }
        catch (error) {
            next(error);
        }
    }
}

export default authController;
