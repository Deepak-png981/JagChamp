const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'Admin'
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;