const Admin = require('../../models/Admin');
const Lesson = require('../../models/Lesson');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        // email , password 
        console.log('Inside the signup with email : ', email);
        if (!email || !password)
            return res.status(404).json({ message: 'Fields cannot be empty' });
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin)
            return res.status(400).json({ message: 'email already exists' });
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //save the admin
        const admin = new Admin({
            email,
            password: hashPassword,
        });
        await admin.save();
        return res.status(201).json({ message: 'Admin Created Successfully' });

    } catch (error) {
        console.log("Error occured in SignUp : ", error);
    }
}
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Inside the signin with email of ADMIN : ", email);
        if (!email || !password)
            return res.status(400).json({ message: 'Email or Password is required' });
        const admin = await Admin.findOne({ email });
        if (!admin)
            return res.status(404).json({ message: 'Invalid credentials' });
        // comparing the password with the admin password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
        const payload = {
            admin: {
                id: admin.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (error) {
        console.log("Error occured in SignUp", error);
    }
}

const createLesson = async (req, res) => {
    try {
        const { lessonNumber, title, content, mcqs } = req.body;
        if (!lessonNumber || !title || !content || !mcqs || !Array.isArray(mcqs) || mcqs.length === 0) {
            return res.status(400).json({ message: 'Invalid lesson data. Make sure lessonNumber, title, content, and mcqs are provided in correct format' });
        }
        // Validating format of mcqs
        for (const mcq of mcqs) {
            if (!mcq.question || !mcq.options || !Array.isArray(mcq.options) || mcq.options.length !== 4 || !Number.isInteger(mcq.correctOptionIndex) || mcq.correctOptionIndex < 0 || mcq.correctOptionIndex >= 4) {
                return res.status(400).json({ message: 'Invalid MCQ format. Each MCQ should have a question, options array with 4 elements, and a correctOptionIndex between 0 and 3' });
            }
        }
        // Creating the lesson
        const newLesson = new Lesson({
            lessonNumber,
            title,
            content,
            mcqs
        });
        await newLesson.save();
        res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({});
        // console.log('lessons : ', lessons);
        // console.log("size : ", lessons.length);
        return res.status(200).json({ length: lessons.length, lessons: lessons });
    } catch (error) {
        console.log("Error occured while getting the lessons : ", error);
    }
}
const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { lessonNumber, title, content, mcqs } = req.body;
        console.log("less : ", lessonNumber);
        if (!lessonNumber || !title || !content || !mcqs || !Array.isArray(mcqs) || mcqs.length === 0) {
            return res.status(400).json({ message: 'Invalid lesson data. Make sure lessonNumber, title, content, and mcqs are provided in correct format' });
        }
        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: `Lesson with ID ${id} does not exist` });
        }

        lesson.lessonNumber = lessonNumber;
        lesson.title = title;
        lesson.content = content;
        lesson.mcqs = mcqs;

        await lesson.save();
        console.log("Updated lesson");
        res.status(200).json({ message: `Lesson with ID ${id} updated successfully`, lesson });
    } catch (error) {
        console.error("Error occurred while updating the lesson:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findOne({ _id: id });
        if (!lesson)
            return res.json(404).json({ message: `Lesson with ID ${id} does not exists` });
        return res.status(200).json({ message: 'Lesson fetched successfully', lesson: lesson });
    } catch (error) {
        console.log('Error occured while getting the Lesson : ', error);
    }
}
const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        // Checking if the lesson with the provided ID exists
        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: `Lesson with ID ${id} does not exist` });
        }
        // Delete the lesson from the database
        await Lesson.findByIdAndDelete(id);
        // Return success response
        res.status(200).json({ message: `Lesson with ID ${id} deleted successfully` });
    } catch (error) {
        console.error("Error occurred while deleting the lesson:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json({ length: users.length, users: users });
    } catch (error) {
        console.error('Error occurred while fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    signup,
    signin,
    createLesson,
    getAllLessons,
    updateLesson,
    getLesson,
    deleteLesson,
    getAllUsers
}