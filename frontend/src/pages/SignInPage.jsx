import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router';
import api from '../lib/axios';
import { Eye, EyeOff } from 'lucide-react';

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    /**
     * Handles form submission for user authentication
     * @param {Event} e - Form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email.trim() || !password.trim()) {
            toast.error("Email and password are required");
            return;
        }

        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('users/auth/signIn', {
                email,
                password
            });

            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                toast.success("Signed in successfully!");
                navigate("/");
            } else {
                toast.error("Sign in failed. Please try again.");
            }
        } catch (error) {
            console.log("Sign in error: ", error);

            // Handle different error responses with appropriate user messages
            if (error.response && error.response.status === 400) {
                toast.error("Invalid email or password");
            } else if (error.response && error.response.status === 429) {
                toast.error("Too many attempts. Please try again later.", {
                    duration: 8000,
                    icon: '⏳',
                });
            } else {
                toast.error("Failed to sign in. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-base-200 flex flex-col'>
            <Navbar />
            <div className='flex-1 flex items-center justify-center p-4'>
                <div className='w-full max-w-md'>
                    {/* Sign In Card */}
                    <div className='card bg-base-100 shadow-xl border border-base-300'>
                        <div className='card-body p-6 sm:p-8'>
                            {/* Header Section */}
                            <div className='text-center mb-6'>
                                <h2 className='text-2xl font-bold text-base-content'>Sign In</h2>
                                <p className='text-base-content/60 mt-2'>Welcome back to Lanka Pharmacy</p>
                            </div>
                            
                            {/* Sign In Form */}
                            <form onSubmit={handleSubmit} className='space-y-4'>
                                {/* Email Field */}
                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text font-medium'>Email Address</span>
                                    </label>
                                    <input 
                                        type='email' 
                                        placeholder='your.email@example.com' 
                                        className='input input-bordered input-md focus:input-primary transition-colors' 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password Field with Toggle Visibility */}
                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text font-medium'>Password</span>
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Enter your password' 
                                            className='input input-bordered input-md focus:input-primary transition-colors w-full' 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        {/* Password Visibility Toggle Button */}
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            tabIndex={-1}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className='form-control mt-6'>
                                    <button 
                                        type='submit' 
                                        className='btn btn-primary btn-md w-full'
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </div>

                                {/* Sign Up Link */}
                                <div className='text-center mt-4'>
                                    <p className='text-base-content/70 text-sm'>
                                        Don't have an account?{' '}
                                        <Link to="/signup" className='link link-primary font-medium'>
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>

                                {/* Forgot Password Link */}
                                <div className='text-center mt-2'>
                                    <p className='text-base-content/70 text-sm'>
                                        <Link to="/forgot-password" className='link link-primary text-sm'>
                                            Forgot your password?
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignInPage;