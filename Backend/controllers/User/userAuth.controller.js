const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Lesson = require('../../models/Lesson');
const signup = async (req, res) => {
    try {
        const { name, email, password, mobileNumber, className } = req.body;
        // email , password 
        console.log('Inside the signup with email : ', email);
        if (!name || !email || !password || !mobileNumber || !className)
            return res.status(404).json({ message: 'Fields cannot be empty' });
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'email already exists' });
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //save the user
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            mobileNumber,
            className
        });
        await newUser.save();
        return res.status(201).json({ message: 'User Created Successfully' });

    } catch (error) {
        console.log("Error occured in SignUp : ", error);
    }
}
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Inside the signin with email : ", email);
        if (!email || !password)
            return res.status(400).json({ message: 'Email or Password is required' });
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'Invalid credentials' });
        // comparing the password with the user password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (error) {
        console.log("Error occured in SignUp", error);
    }
}

const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({});
        return res.status(200).json({ length: lessons.length, lessons: lessons });
    } catch (error) {
        console.log('Error occured while getting all the lessons : ', error);
    }
}

const getLessonByID = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findOne({ _id: id });
        if (!lesson)
            return res.status(404).json({ message: `Lesson with ID ${id} does not exists` });
        return res.status(200).json({ lesson: lesson });

    } catch (error) {
        console.log(`Error occured while getting all the lesson with ID ${ID}`);
    }
}

module.exports = {
    signup,
    signin,
    getAllLessons,
    getLessonByID
}