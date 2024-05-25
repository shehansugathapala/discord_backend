const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = process.env;

const verifyToken = async (req, res, next) => {
    try {
        let token;

        // Check if the token is present in the request body, query parameters, or headers
        if (req.body && req.body.token) {
            token = req.body.token;
        } else if (req.query && req.query.token) {
            token = req.query.token;
        } else if (req.headers && req.headers.authorization) {
            // Extract the token from the authorization header
            const authHeader = req.headers.authorization;
            const tokenParts = authHeader.split(' ');
            if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
                token = tokenParts[1];
            }
        }

        // If token is not found in any of the expected locations, return 403 Forbidden
        if (!token) {
            console.log('Token not found');
            return res.status(403).send('A token is required for authentication');
        }

        // Verify the token
        const decoded = jwt.verify(token, config.TOKEN_KEY);

        // Fetch user data based on the decoded token's userId
        const user = await User.findOne({ _id: decoded.userId });

        // If user is not found, return 404 Not Found
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        // Attach the user object to the request for further processing
        req.user = user;

        // Proceed to the next middleware
        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        // If token is invalid or verification fails, return 401 Unauthorized
        return res.status(401).send('Invalid Token');
    }
};

module.exports = verifyToken;
