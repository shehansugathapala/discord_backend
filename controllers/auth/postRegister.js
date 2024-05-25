const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");  // Import the jwt library

const postRegister = async (req, res) => {
    try {
        const {  serial,username, mail, password,isAdmin, } = req.body;

        // Check if user exists
        const userExists = await User.exists({ mail: mail.toLowerCase() });

        if (userExists) {
            return res.status(409).send("E-mail already in use");
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user document and save in the database
        const user = await User.create({
            username,
            serial,
            mail: mail.toLowerCase(),
            password: encryptedPassword,
         
            isAdmin: isAdmin || false // Set isAdmin to false if not provided
        });

        // Create JWT token
        const token = jwt.sign({
             userId: user._id, 
             mail
            }, 
            process.env.TOKEN_KEY,{
              expiresIn:"24h", 
            }
            );

        // Respond with user details and token
        res.status(201).json({
            userDetails: {
                mail: user.mail,

                token: token, 
                serial:User.serial,
                username: user.username,
                isAdmin: user.isAdmin // Include isAdmin in the response
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Error occurred. Please try again");
    }
};

module.exports = postRegister;
