import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router';
import api from '../lib/axios';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo.jpg'

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    // Load remembered email from localStorage on component mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    /**
     * Handles form submission for user authentication
     * @param {Event} e - Form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation for required fields
        if (!email.trim() || !password.trim()) {
            toast.error("Email and password are required");
            return;
        }

        // Email format validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('users/auth/signin', {
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
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <Navbar />
            <div className='flex-1 flex items-center justify-center p-4 py-12'>
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJ2MmgtMnptMCA0aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

                <div className='relative w-full max-w-md'>
                    {/* Back to Home Link */}
                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors duration-200">
                        <ArrowLeft className="size-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    {/* Sign In Card Container */}
                    <div className='bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100'>
                        {/* Header Section with Gradient Background */}
                        <div className='bg-gradient-to-br from-emerald-600 to-emerald-700 px-8 py-10 text-center'>
                            <div className="inline-block bg-white p-3 rounded-2xl shadow-xl mb-4">
                                <img src={Logo} width="50" height="50" />
                            </div>
                            <h2 className='text-3xl font-bold text-white mb-2'>Welcome Back</h2>
                            <p className='text-emerald-100'>Sign in to your Lanka Pharmacy account</p>
                        </div>
                        
                        {/* Form Section */}
                        <div className='p-8'>
                            <div className='space-y-6'>
                                {/* Email Field with Icon */}
                                <div className='form-control'>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Mail className="size-5" />
                                        </div>
                                        <input 
                                            type='email' 
                                            placeholder='your.email@example.com' 
                                            className='w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800'
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field with Visibility Toggle */}
                                <div className='form-control'>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Lock className="size-5" />
                                        </div>
                                        <input 
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Enter your password' 
                                            className='w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800'
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        {/* Password Visibility Toggle Button */}
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password Section */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                                        <span className="text-sm text-gray-600">Remember me</span>
                                    </label>
                                    <Link to="/forgot-password" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200">
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <div className='form-control'>
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className='w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed'
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Signing In...</span>
                                            </>
                                        ) : (
                                            <span>Sign In</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Divider for Social Login Options */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Google
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium">
                                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    Facebook
                                </button>
                            </div>

                            {/* Sign Up Link */}
                            <p className='text-center mt-8 text-gray-600'>
                                Don't have an account?{' '}
                                <Link to="/signup" className='font-bold text-emerald-600 hover:text-emerald-700 transition-colors duration-200'>
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Security Trust Badge */}
                    <div className="text-center mt-6 text-sm text-gray-500">
                        <p>🔒 Your data is secure and encrypted</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignInPage;