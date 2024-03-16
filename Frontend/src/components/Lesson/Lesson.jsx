import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { URL } from '../../Data/variables';

export default function Lesson() {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [error, setError] = useState(null);
    const [selectedMcqIndex, setSelectedMcqIndex] = useState(null);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
    const [showCongratulations, setShowCongratulations] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        console.log(id);
        const token = localStorage.getItem('token');
        const fetchLesson = async () => {
            try {
                const response = await fetch(`${URL}/user/auth/lesson/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setLesson(data.lesson);
                    console.log("data : ", data);
                } else {
                    setError('Failed to fetch lesson');
                }
            } catch (error) {
                console.log('Error:', error);
                setError('Failed to fetch lesson');
            }
        };

        fetchLesson();
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!lesson) {
        return <div>Loading...</div>;
    }
    const handleAccordionClick = (index) => {
        // setSelectedMcqIndex(index);
        // setSelectedOptionIndex(null);
        if (selectedMcqIndex === index) {
            // If the same accordion is clicked again, close it
            setSelectedMcqIndex(null);
        } else {
            setSelectedMcqIndex(index);
            setSelectedOptionIndex(null); // Reset selected option when opening a new accordion
        }
    };

    const handleOptionClick = (mcqIndex, optionIndex) => {
        // setSelectedOptionIndex(optionIndex);
        if (lesson.mcqs[mcqIndex].correctOptionIndex === optionIndex) {
            // Correct option selected
            if (mcqIndex === lesson.mcqs.length - 1) {
                // Last MCQ, show congratulations
                setShowCongratulations(true);
            } else {
                // Close current accordion and open next one
                setSelectedMcqIndex(mcqIndex + 1);
                setSelectedOptionIndex(null);
            }
        } else {
            // Incorrect option selected
            setSelectedOptionIndex(optionIndex);
        }
    };
    const handleGoToHomeCase = () => {
        console.log("hi");
        // setShowCongratulations(false);
        navigate('/lessons')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="lg:flex lg:justify-between">
                {/* Left Column */}
                <div className="lg:w-1/2 mb-8 lg:mb-0">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-4">
                            <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
                            <p className="mt-2 text-gray-600">{lesson.description}</p>
                        </div>
                        <div className="p-4 bg-gray-100 border-t border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Content</h2>
                            <p className="text-gray-700">{lesson.content} ndicate which sections are expanded or collapsed - you can use icons like plus and minus.
                                • For a smoother UX, use Tailwind CSS basic transitions and animations to animate the opening and closing of accordion sections.
                                • Allow users to expand multiple sections simultaneously. If not, ensure that expanding one section collapses any previously expanded section.
                                • Make sure that the sections don't contain too large amounts of content
                                • Test your accordion to work consistently across different browsers and devices</p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:w-1/2">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-4">
                            <p className="mt-2 text-gray-600">{lesson.description}</p>
                        </div>
                        <div className="p-4 bg-gray-100 border-t border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">MCQ Questions</h2>
                            {lesson.mcqs.map((mcq, index) => (
                                <div key={mcq._id} className="mb-4 border-b border-gray-200">
                                    <div
                                        className="flex justify-between items-center cursor-pointer py-3"
                                        onClick={() => handleAccordionClick(index)}
                                    >
                                        <span className="text-lg font-medium text-gray-800">{mcq.question}</span>
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${selectedMcqIndex === index ? 'rotate-180' : ''}`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 13a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-.707.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    {selectedMcqIndex === index && (
                                        <div className="p-4 bg-gray-50 rounded-lg mt-2">
                                            {mcq.options.map((option, optionIndex) => (
                                                <div
                                                    key={optionIndex}
                                                    className={`flex items-center cursor-pointer py-2 border border-gray-300 rounded-md ${optionIndex === selectedOptionIndex ? (mcq.correctOptionIndex === optionIndex ? 'bg-green-100' : 'bg-red-100') : ''}`}
                                                    onClick={() => handleOptionClick(index, optionIndex)}
                                                >
                                                    <span className="ml-2 text-lg font-medium">{option}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showCongratulations && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
                        <p className="text-gray-600">You have completed the lesson.</p>
                        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={() => handleGoToHomeCase()}>Go to Home</button>
                    </div>
                </div>
            )}
        </div>
    );

}



