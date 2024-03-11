const mongoose = require('mongoose');
const mcqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctOptionIndex: {
        type: Number,
        required: true
    }
});
const lessonSchema = new mongoose.Schema({
    lessonNumber: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mcqs: {
        type: [mcqSchema],
        default: []
    }
});
const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
