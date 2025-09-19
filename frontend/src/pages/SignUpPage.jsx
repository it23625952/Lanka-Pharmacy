import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router';
import api from '../lib/axios';
import { Eye, EyeOff } from 'lucide-react';

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Live password validation state - tracks password complexity requirements
    const passwordChecks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[@$!%*?&]/.test(password),
    };

    const navigate = useNavigate();

    /**
     * Handles form submission for user registration
     * @param {Event} e - Form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Password complexity requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Validate all fields are filled
        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            toast.error("All fields are required");
            return;
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Validate password complexity
        if (!passwordRegex.test(password)) {
            toast.error(
                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
            );
            return;
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('users/auth/signup', {
                name,
                email,
                password,
                confirmPassword
            });

            // Handle successful registration
            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                toast.success("Account created and logged in!");
                navigate("/");
            } else {
                toast.success("Account created, please log in.");
                navigate("/signIn"); // Fixed typo from "sifnIn" to "signIn"
            }
        } catch (error) {
            console.log("Signup error: ", error);

            // Handle specific error responses
            if (error.response && error.response.status === 409) {
                toast.error("An account with this email already exists.");
            } else if (error.response && error.response.status === 429) {
                toast.error("Too many requests. Please try again later.", {
                    duration: 8000,
                    icon: '⏳',
                });
            } else {
                toast.error("Failed to create account. Please try again.");
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
                    {/* Sign Up Card */}
                    <div className='card bg-base-100 shadow-xl border border-base-300'>
                        <div className='card-body p-6 sm:p-8'>
                            {/* Header Section */}
                            <div className='text-center mb-6'>
                                <h2 className='text-2xl font-bold text-base-content'>Create Account</h2>
                                <p className='text-base-content/60 mt-2'>Join Lanka Pharmacy today</p>
                            </div>
                            
                            {/* Registration Form */}
                            <form onSubmit={handleSubmit} className='space-y-4'>
                                {/* Name Field */}
                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text font-medium'>Full Name</span>
                                    </label>
                                    <input 
                                        type='text' 
                                        placeholder='Enter your full name' 
                                        className='input input-bordered input-md focus:input-primary transition-colors' 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

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
                                    />
                                </div>

                                {/* Password Field with Strength Indicator */}
                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text font-medium'>Password</span>
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Create a strong password' 
                                            className='input input-bordered input-md focus:input-primary transition-colors w-full' 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {/* Password Visibility Toggle */}
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            tabIndex={-1}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {/* Password strength indicators with visual feedback */}
                                    <ul className="mt-2 ml-1 text-xs space-y-1">
                                        <li className={passwordChecks.length ? "text-green-600" : "text-gray-500"}>
                                            {passwordChecks.length ? "✓" : "○"} At least 8 characters
                                        </li>
                                        <li className={passwordChecks.upper ? "text-green-600" : "text-gray-500"}>
                                            {passwordChecks.upper ? "✓" : "○"} One uppercase letter
                                        </li>
                                        <li className={passwordChecks.lower ? "text-green-600" : "text-gray-500"}>
                                            {passwordChecks.lower ? "✓" : "○"} One lowercase letter
                                        </li>
                                        <li className={passwordChecks.number ? "text-green-600" : "text-gray-500"}>
                                            {passwordChecks.number ? "✓" : "○"} One number
                                        </li>
                                        <li className={passwordChecks.special ? "text-green-600" : "text-gray-500"}>
                                            {passwordChecks.special ? "✓" : "○"} One special character (@$!%*?&)
                                        </li>
                                    </ul>
                                </div>

                                {/* Confirm Password Field */}
                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text font-medium'>Confirm Password</span>
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder='Confirm your password' 
                                            className='input input-bordered input-md focus:input-primary transition-colors w-full' 
                                            value={confirmPassword} 
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        {/* Confirm Password Visibility Toggle */}
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            tabIndex={-1}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </div>

                                {/* Sign In Link */}
                                <div className='text-center mt-4'>
                                    <p className='text-base-content/70 text-sm'>
                                        Already have an account?{' '}
                                        <a href='/signIn' className='link link-primary font-medium'>
                                            Sign In
                                        </a>
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

export default SignUpPage;