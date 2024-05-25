const express = require('express');
const router = express.Router();
const authControllers = require("../controllers/auth/authControllers");
const joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const User = require('../models/user');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ChatMessage = require('../models/ChatMessage');

// Import the verifyToken middleware
const auth = require('../middleware/auth');





const registerSchema = joi.object({
    username: joi.string().min(3).max(12).required(),
    serial: joi.string().min(3).max(12).required(),
    password: joi.string().min(6).max(12).required(),
    mail: joi.string().email().required(),
    isAdmin: joi.boolean().required()
});

const loginSchema = joi.object({
    password: joi.string().min(6).max(12).required(),
    mail: joi.string().email().required(),
});

router.post("/register", validator.body(registerSchema), authControllers.controllers.postRegister);
router.post("/login", validator.body(loginSchema), authControllers.controllers.postLogin);

// Route to fetch user details by ID


router.get("/user/:serial", async (req, res) => {
    try {
        // Trim whitespace from the serial number
        const serial = req.params.serial.trim();

        // Fetch user details from the database
        const user = await User.findOne({ serial });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user details
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});









// Function to save chat message to MongoDB
async function saveChatMessageToDB(message) {
    const chatMessage = new ChatMessage({ message });
    await chatMessage.save();
}



// Test route to verify if our middleware is working
router.get('/test', auth, (req, res) => {
    res.send("Request passed");
});

module.exports = router;
