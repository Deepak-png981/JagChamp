const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const isAdminAuthenticated = async (req, res, next) => {
    try {
        const authHeaders = req.headers.authorization;
        if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization denied.' });
        }
        const token = authHeaders.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. Token is missing' });
        }
        // Verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded : ", decoded);
        // Check if the user exists and is an admin
        const admin = await Admin.findById(decoded.admin.id);
        // console.log("admin : ", admin);
        if (!admin || admin.role !== 'Admin') {
            return res.status(403).json({ message: 'Forbidden. Only admins are allowed to access this route' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Error authenticating admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const isUserAuthenticated = async (req, res, next) => {
    try {
        const authHeaders = req.headers.authorization;
        if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization denied.' });
        }
        const token = authHeaders.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. Token is missing' });
        }
        //verifying the token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded : ", decoded);
        const user = await User.findById(decoded.user.id);
        console.log("User : ", user);
        if (!user || user.role !== 'Student') {
            return res.status(403).json({ message: 'Forbidden.' })
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Errro authenticating user : ', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}
module.exports = {
    isAdminAuthenticated,
    isUserAuthenticated
};
