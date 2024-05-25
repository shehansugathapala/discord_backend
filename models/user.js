const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    serial: { type: Number, unique: true },
    mail: { type: String, unique: true },
    username: { type: String },
    password: { type: String },
    isAdmin: { type: String },
});

module.exports = mongoose.model("User", userSchema);


