const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'Student'
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: {
        type: String
    },
    tensesProgress: {
        type: Number,
        default: 0
    },
    className: { //studies in which class
        type: Number,
    }

});
const User = mongoose.model('User', UserSchema);

module.exports = User;