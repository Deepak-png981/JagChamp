import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { URL } from '../../../Data/variables';

export default function AdminHome() {
    const [lessons, setLessons] = useState([]);
    // const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                // Get token from local storage
                const token = localStorage.getItem('adminToken');

                const response = await fetch(`${URL}/admin/auth/lessons`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add authorization token
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setLessons(data.lessons);
                } else {
                    console.log("response  : ", response);
                    localStorage.removeItem('adminToken');
                    navigate('/signin')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchLessons();
    }, []);

    return (<div className='mt-10 mb-10'>

        <div className="container mx-auto" style={{ display: "flex", justifyContent: "center" }}>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {/* creating lessson button  */}
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Create New Lesson</h5>
                    <p className="mb-3 font-normal text-gray-700">Click the button below to create a new lesson.</p>
                    <Link to="/admin/create-lesson" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 focus:ring-blue-300 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                        Create Lesson
                    </Link>
                </div>

                {lessons.map(lesson => (
                    <div key={lesson._id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{lesson.title}</h5>
                        <p className="mb-3 font-normal text-gray-700">{lesson.description}</p>
                        <Link to={`/admin-lesson/${lesson._id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 focus:ring-orange-300 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                            Read more
                            <svg className="w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
}
