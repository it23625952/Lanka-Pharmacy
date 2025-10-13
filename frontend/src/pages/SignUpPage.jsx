import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router';
import api from '../lib/axios';
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft, CheckCircle, X } from 'lucide-react';
import Logo from '../components/Logo.jpg'

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

    // Validation state for form submission
    const allRequirementsMet = Object.values(passwordChecks).every(check => check);
    const passwordsMatch = password && password === confirmPassword;

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
                navigate("/signin");
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

    /**
     * Reusable component for password requirement items
     * @param {Object} props - Component props
     * @param {boolean} props.met - Whether the requirement is met
     * @param {string} props.text - Requirement description text
     * @returns {JSX.Element} Requirement list item
     */
    const RequirementItem = ({ met, text }) => (
        <li className={`flex items-center gap-2 text-sm transition-colors duration-200 ${met ? 'text-emerald-600' : 'text-gray-500'}`}>
            {met ? (
                <CheckCircle className="size-4 flex-shrink-0" />
            ) : (
                <div className="size-4 rounded-full border-2 border-current flex-shrink-0" />
            )}
            <span>{text}</span>
        </li>
    );

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <Navbar />
            <div className='flex-1 flex items-center justify-center p-4 py-12'>
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJ2MmgtMnptMCA0aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

                <div className='relative w-full max-w-lg'>
                    {/* Back to Home Link */}
                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors duration-200">
                        <ArrowLeft className="size-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    {/* Sign Up Card Container */}
                    <div className='bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100'>
                        {/* Header Section with Gradient Background */}
                        <div className='bg-gradient-to-br from-emerald-600 to-emerald-700 px-8 py-10 text-center'>
                            <div className="inline-block bg-white p-3 rounded-2xl shadow-xl mb-4">
                                <img src={Logo} width="50" height="50" alt="Lanka Pharmacy Logo" />
                            </div>
                            <h2 className='text-3xl font-bold text-white mb-2'>Create Account</h2>
                            <p className='text-emerald-100'>Join Lanka Pharmacy today</p>
                        </div>
                        
                        {/* Form Section */}
                        <div className='p-8'>
                            <div className='space-y-6'>
                                {/* Name Field with Icon */}
                                <div className='form-control'>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <User className="size-5" />
                                        </div>
                                        <input 
                                            type='text' 
                                            placeholder='John Doe' 
                                            className='w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800'
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

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
                                        />
                                    </div>
                                </div>

                                {/* Password Field with Strength Indicator */}
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
                                            placeholder='Create a strong password' 
                                            className='w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800'
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)}
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
                                    {/* Password Requirements Visualization */}
                                    {password && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                                            <h4 className="font-semibold text-gray-700 text-sm mb-3">Password Requirements:</h4>
                                            <ul className="grid grid-cols-2 gap-2">
                                                <RequirementItem met={passwordChecks.length} text="8+ characters" />
                                                <RequirementItem met={passwordChecks.upper} text="Uppercase letter" />
                                                <RequirementItem met={passwordChecks.lower} text="Lowercase letter" />
                                                <RequirementItem met={passwordChecks.number} text="Number" />
                                                <RequirementItem met={passwordChecks.special} text="Special character" />
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password Field with Validation */}
                                <div className='form-control'>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Lock className="size-5" />
                                        </div>
                                        <input 
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder='Confirm your password' 
                                            className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl outline-none transition-all duration-200 text-gray-800 ${
                                                confirmPassword && !passwordsMatch
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                                    : 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                                            }`}
                                            value={confirmPassword} 
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        {/* Confirm Password Visibility Toggle Button */}
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                        </button>
                                    </div>
                                    {/* Password Match Validation Messages */}
                                    {confirmPassword && !passwordsMatch && (
                                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                            <X className="size-4" />
                                            <span>Passwords do not match</span>
                                        </div>
                                    )}
                                    {confirmPassword && passwordsMatch && (
                                        <div className="mt-2 flex items-center gap-2 text-emerald-600 text-sm">
                                            <CheckCircle className="size-4" />
                                            <span>Passwords match</span>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className='form-control mt-8'>
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={loading || !allRequirementsMet || !passwordsMatch}
                                        className='w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Creating Account...</span>
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </div>

                                {/* Sign In Link */}
                                <div className='text-center pt-6 border-t border-gray-200'>
                                    <p className='text-gray-600'>
                                        Already have an account?{' '}
                                        <Link to='/signIn' className='font-bold text-emerald-600 hover:text-emerald-700 transition-colors duration-200'>
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
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

export default SignUpPage;