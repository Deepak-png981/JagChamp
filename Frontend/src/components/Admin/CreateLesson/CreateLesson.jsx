import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { URL } from '../../../Data/variables';

export default function CreateLesson() {
    const navigate = useNavigate();
    const [lessonData, setLessonData] = useState({
        lessonNumber: '',
        title: '',
        content: '',
        mcqs: [
            { question: '', options: '', correctOptionIndex: '' }
        ]
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (name.startsWith('mcqQuestion')) {
            const mcqs = [...lessonData.mcqs];
            mcqs[index].question = value;
            setLessonData(prevLessonData => ({
                ...prevLessonData,
                mcqs
            }));
        } else if (name.startsWith('mcqOptions')) {
            const mcqs = [...lessonData.mcqs];
            mcqs[index].options = value;
            setLessonData(prevLessonData => ({
                ...prevLessonData,
                mcqs
            }));
        } else if (name.startsWith('mcqCorrectOption')) {
            const mcqs = [...lessonData.mcqs];
            mcqs[index].correctOptionIndex = value;
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

    const addMCQ = () => {
        setLessonData(prevLessonData => ({
            ...prevLessonData,
            mcqs: [...prevLessonData.mcqs, { question: '', options: '', correctOptionIndex: '' }]
        }));
    };

    const removeMCQ = (index) => {
        setLessonData(prevLessonData => ({
            ...prevLessonData,
            mcqs: prevLessonData.mcqs.filter((mcq, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!lessonData.lessonNumber.trim()) {
            errors.lessonNumber = 'Lesson Number is required';
        }
        if (!lessonData.title.trim()) {
            errors.title = 'Title is required';
        }
        if (!lessonData.content.trim()) {
            errors.content = 'Content is required';
        }
        lessonData.mcqs.forEach((mcq, index) => {
            if (!mcq.question.trim()) {
                errors[`mcqQuestion${index}`] = 'Question is required';
            }
            if (!mcq.options.trim()) {
                errors[`mcqOptions${index}`] = 'Options are required';
            }
            if (!mcq.correctOptionIndex.trim()) {
                errors[`mcqCorrectOption${index}`] = 'Correct Option Index is required';
            }
        });

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${URL}/admin/auth/createLesson`, {
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
                            question: mcq.question,
                            options: mcq.options.split('\n').map(option => option.trim()),
                            correctOptionIndex: parseInt(mcq.correctOptionIndex)
                        }))
                    })
                });
                if (response.ok) {
                    console.log('Lesson created successfully');
                    alert('Lesson created successfully');
                    navigate('/admin/home');
                } else {
                    console.error('Failed to create lesson:', response);
                    // Handle error, maybe show an error message to the user
                }
            } catch (error) {
                console.error('Error creating lesson:', error);
                // Handle error, maybe show an error message to the user
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Create Lesson</h1>
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
                            {errors[`mcqQuestion${index}`] && <div className="text-red-500">{errors[`mcqQuestion${index}`]}</div>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor={`mcqOptions${index}`} className="font-semibold mb-1">Options (one per line):</label>
                            <textarea id={`mcqOptions${index}`} name={`mcqOptions${index}`} value={mcq.options} onChange={(e) => handleChange(e, index)} className="border border-gray-300 rounded-md px-3 py-2"></textarea>
                            {errors[`mcqOptions${index}`] && <div className="text-red-500">{errors[`mcqOptions${index}`]}</div>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor={`mcqCorrectOption${index}`} className="font-semibold mb-1">Correct Option Index:</label>
                            <input type="number" id={`mcqCorrectOption${index}`} name={`mcqCorrectOption${index}`} value={mcq.correctOptionIndex} onChange={(e) => handleChange(e, index)} className="border border-gray-300 rounded-md px-3 py-2" />
                            {errors[`mcqCorrectOption${index}`] && <div className="text-red-500">{errors[`mcqCorrectOption${index}`]}</div>}
                        </div>
                        {index === lessonData.mcqs.length - 1 && (
                            <button type="button" onClick={addMCQ} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300">Add MCQ</button>
                        )}
                        {index > 0 && (
                            <button type="button" onClick={() => removeMCQ(index)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 mt-2">Remove MCQ</button>
                        )}
                    </div>
                ))}
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300">Create Lesson</button>
            </form>
        </div>
    );
}
