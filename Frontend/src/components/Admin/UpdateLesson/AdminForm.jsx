import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { URL } from '../../../Data/variables';

export default function AdminForm() {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const navigate = useNavigate();
    const [lessonData, setLessonData] = useState({
        lessonNumber: '',
        title: '',
        content: '',
        mcqs: []
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const fetchLesson = async () => {
            try {
                const response = await fetch(`${URL}/admin/auth/lesson/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch lesson');
                }
                const { lesson } = await response.json();
                setLesson(lesson);
                setLessonData({
                    lessonNumber: lesson.lessonNumber,
                    title: lesson.title,
                    content: lesson.content,
                    mcqs: lesson.mcqs.map(mcq => ({
                        ...mcq,
                        options: mcq.options.join('\n') // Convert options array to newline-separated string
                    }))
                });
            } catch (error) {
                console.error('Error fetching lesson:', error);
            }
        };
        fetchLesson();
    }, [id]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (name.startsWith('mcqQuestion')) {
            const mcqs = [...lessonData.mcqs];
            const mcqIndex = parseInt(name.substring(11), 10); // Adjust the substring length to match 'mcqQuestion'
            mcqs[mcqIndex].question = value; // Change 'mcqQue' to 'question'
            setLessonData(prevLessonData => ({
                ...prevLessonData,
                mcqs
            }));
        } else if (name.startsWith('mcqOptions')) {
            const mcqs = [...lessonData.mcqs];
            const mcqIndex = parseInt(name.substring(10), 10); // Adjust the substring length to match 'mcqOptions'
            mcqs[mcqIndex].options = value; // Change 'mcqQue' to 'options'
            setLessonData(prevLessonData => ({
                ...prevLessonData,
                mcqs
            }));
        } else if (name.startsWith('mcqCorrectOption')) {
            const mcqs = [...lessonData.mcqs];
            const mcqIndex = parseInt(name.substring(16), 10); // Adjust the substring length to match 'mcqCorrectOption'
            mcqs[mcqIndex].correctOptionIndex = value; // Change 'mcqQue' to 'correctOptionIndex'
            setLessonData(prevLessonData => ({
                ...prevLessonData,
                mcqs
            }));
        } else {
            setLessonData(prevLessonData => ({
                ...prevLessonData,
                [name]: value
            }));
        }
    };


    const validateForm = () => {
        const errors = {};

        const lessonNumber = String(lessonData.lessonNumber); // Ensure lessonNumber is a string
        if (!lessonNumber.trim()) {
            errors.lessonNumber = 'Lesson Number is required';
        }
        if (!lessonData.title.trim()) {
            errors.title = 'Title is required';
        }
        if (!lessonData.content.trim()) {
            errors.content = 'Content is required';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        if (validateForm()) {
            try {
                const response = await fetch(`${URL}/admin/auth/lesson/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        lessonNumber: lessonData.lessonNumber,
                        title: lessonData.title,
                        content: lessonData.content,
                        mcqs: lessonData.mcqs.map(mcq => ({
                            ...mcq,
                            options: mcq.options.split('\n')
                        }))
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to update lesson');
                }
                console.log("great");
                navigate(`/admin-lesson/${id}`)
            } catch (error) {
                console.error('Error updating lesson:', error);
                // Handle error, maybe show an error message to the user
            }
        }
    };

    if (!lesson) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Edit Lesson</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="lessonNumber" className="font-semibold mb-1">Lesson Number:</label>
                    <input type="text" id="lessonNumber" name="lessonNumber" value={lessonData.lessonNumber} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    {errors.lessonNumber && <div className="text-red-500">{errors.lessonNumber}</div>}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="title" className="font-semibold mb-1">Title:</label>
                    <input type="text" id="title" name="title" value={lessonData.title} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    {errors.title && <div className="text-red-500">{errors.title}</div>}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="content" className="font-semibold mb-1">Content:</label>
                    <textarea id="content" name="content" value={lessonData.content} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2"></textarea>
                    {errors.content && <div className="text-red-500">{errors.content}</div>}
                </div>
                <h2 className="text-lg font-semibold">MCQ Questions:</h2>
                {lessonData.mcqs.map((mcq, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex flex-col">
                            <label htmlFor={`mcqQuestion${index}`} className="font-semibold mb-1">Question:</label>
                            <input type="text" id={`mcqQuestion${index}`} name={`mcqQuestion${index}`} value={mcq.question} onChange={(e) => handleChange(e, index)} className="border border-gray-300 rounded-md px-3 py-2" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor={`mcqOptions${index}`} className="font-semibold mb-1">Options (one per line):</label>
                            <textarea id={`mcqOptions${index}`} name={`mcqOptions${index}`} value={mcq.options} onChange={(e) => handleChange(e, index)} className="border border-gray-300 rounded-md px-3 py-2"></textarea>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor={`mcqCorrectOption${index}`} className="font-semibold mb-1">Correct Option Index:</label>
                            <input type="number" id={`mcqCorrectOption${index}`} name={`mcqCorrectOption${index}`} value={mcq.correctOptionIndex} onChange={(e) => handleChange(e, index)} className="border border-gray-300 rounded-md px-3 py-2" />
                        </div>
                    </div>
                ))}
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300">Update Lesson</button>
            </form>
        </div>
    );
}
