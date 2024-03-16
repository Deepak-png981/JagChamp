import React from 'react';

export default function About() {
    return (
        <div className="py-16 bg-white">
            <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
                <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
                    <div className="md:5/12 lg:w-5/12">
                        <img
                            src="https://tailus.io/sources/blocks/left-image/preview/images/startup.png"
                            alt="image"
                        />
                    </div>
                    <div className="md:7/12 lg:w-6/12">
                        <h2 className="text-2xl text-gray-900 font-bold md:text-4xl">
                            Discover the World of Tenses with Our Quiz Platform
                        </h2>
                        <p className="mt-6 text-gray-600">
                            Our platform is dedicated to helping users master English tenses through interactive quizzes and exercises. Whether you're a student looking to improve your grammar skills or a teacher seeking engaging resources for your classroom, our platform offers a diverse range of quizzes tailored to various proficiency levels.
                        </p>
                        <p className="mt-4 text-gray-600">
                            With a user-friendly interface and comprehensive content, our platform makes learning English tenses enjoyable and effective. Join our community today and embark on a journey to linguistic proficiency!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
