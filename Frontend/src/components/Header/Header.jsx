import React, { useEffect, useState } from "react";
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState('');
    const [token, setToken] = useState('');
    const [adminToken, setAdminToken] = useState('');
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } else {
            const tokenAdmin = localStorage.getItem('adminToken');
            setAdminToken(tokenAdmin);
        }
        // console.log("user : ", user.name);
    }, [setUser, adminToken]);

    // Function to handle logout
    const handleLogout = () => {
        // Remove token from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };
    const handleLogoutAdmin = () => {
        localStorage.removeItem('adminToken');
        setDropdownOpen(false);
        navigate('/');
    }
    // Check if the user is signed in
    const isSignedIn = localStorage.getItem('token');

    return (
        <header className="shadow sticky z-50 top-0">
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link
                        to="/"
                        className="flex items-center text-white bg-orange-700 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                    >
                        Jag Champ
                    </Link>
                    <div className="flex items-center lg:order-2">
                        {/* Conditional rendering based on sign-in status */}
                        {isSignedIn ? (
                            <div className="relative">
                                {/* User's name */}
                                <div className="flex items-center mr-4">
                                    {/* User's name */}
                                    <div className="text-gray-700 font-semibold bg-blue-700 mr-2 flex items-center text-white focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none">
                                        {user.name}
                                    </div>
                                    {/* Dropdown toggle */}
                                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
                                        <span className="mr-1">▼</span>
                                    </button>
                                    {/* Dropdown menu */}
                                    {dropdownOpen && (
                                        <div className="absolute mt-20 right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                            <button onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none">Logout</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        ) : adminToken ? (

                            <div>
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
                                    <span className="mr-1">▼</span>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute mt-20 right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                        <button onClick={handleLogoutAdmin} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none">Logout</button>
                                    </div>)}
                            </div>


                        ) : (
                            // Sign-up and Sign-in links
                            <div className="flex items-center">
                                <Link
                                    to="/signup"
                                    className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    to="/signin"
                                    className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink
                                    // to={token ? "/lessons" : "/"}
                                    to={token ? "/lessons" : adminToken ? "/admin/home" : "/"}
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    {token ? 'Lessons' : 'Home'}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    // to="/contact"
                                    to={adminToken ? "/admin/all-user" : "/contact"}
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    {adminToken ? "All Users" : "Contact"}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/hall-of-fame"
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Hall of Fame
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}


