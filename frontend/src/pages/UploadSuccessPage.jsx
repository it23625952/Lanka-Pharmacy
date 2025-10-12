import React from 'react';
import Navbar from '../components/Navbar';
import { CheckCircle, Mail, Clock, Home, Upload, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const UploadSuccessPage = () => {
    const location = useLocation();
    const { prescriptionId, status } = location.state || {};

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJ2MmgtMnptMCA0aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
            
            <Navbar />

            <div className='flex-1 flex items-center justify-center p-4 py-12 relative z-10'>
                <div className='w-full max-w-2xl'>
                    {/* Success Card */}
                    <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
                        {/* Header Section */}
                        <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-12 text-center'>
                            <div className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-3xl shadow-xl mb-6">
                                <CheckCircle className='size-16 text-white' />
                            </div>
                            <h2 className='text-4xl font-bold text-white mb-4'>Prescription Uploaded Successfully!</h2>
                            <p className='text-emerald-100 text-lg'>Your prescription has been received and is being processed</p>
                        </div>
                        
                        {/* Content Section */}
                        <div className='p-8'>
                            {/* Status Information */}
                            <div className='bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div className='flex items-center gap-4'>
                                        <div className="w-12 h-12 bg-white border border-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                                            <Clock className='size-6 text-emerald-600' />
                                        </div>
                                        <div>
                                            <p className='text-emerald-700 text-sm font-medium'>Current Status</p>
                                            <p className='text-emerald-800 text-xl font-semibold capitalize'>{status || 'Pending Verification'}</p>
                                        </div>
                                    </div>

                                    {prescriptionId && (
                                        <div className='flex items-center gap-4'>
                                            <div className="w-12 h-12 bg-white border border-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                                                <FileText className='size-6 text-emerald-600' />
                                            </div>
                                            <div>
                                                <p className='text-emerald-700 text-sm font-medium'>Reference ID</p>
                                                <p className='text-emerald-800 text-lg font-mono font-semibold'>{prescriptionId}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Information Messages */}
                            <div className='space-y-6 mb-8'>
                                <div className='text-center'>
                                    <p className='text-gray-600 text-lg leading-relaxed'>
                                        Your prescription has been received and is waiting for verification by our pharmacy staff.
                                    </p>
                                </div>
                                
                                <div className='bg-blue-50 border border-blue-200 rounded-2xl p-6'>
                                    <div className='flex items-start gap-4'>
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className='size-5 text-blue-600' />
                                        </div>
                                        <div>
                                            <h4 className='text-blue-800 font-semibold text-lg mb-2'>What happens next?</h4>
                                            <ul className='text-blue-700 space-y-2 text-left'>
                                                <li className='flex items-center gap-2'>
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    Our pharmacy team will verify your prescription
                                                </li>
                                                <li className='flex items-center gap-2'>
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    We'll check medication availability and pricing
                                                </li>
                                                <li className='flex items-center gap-2'>
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    You'll receive an email once ready for ordering
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className='text-center'>
                                    <p className='text-gray-500 text-md'>
                                        Typically processed within 1-2 hours during business hours
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200'>
                                <Link 
                                    to='/' 
                                    className='flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg'
                                >
                                    <Home className="size-5" />
                                    Return to Home
                                </Link>
                                <Link 
                                    to='/upload-prescription' 
                                    className='flex-1 py-4 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-lg'
                                >
                                    <Upload className="size-5" />
                                    Upload Another
                                </Link>
                            </div>

                            {/* Support Information */}
                            <div className='text-center mt-8 pt-6 border-t border-gray-200'>
                                <p className='text-gray-500 text-sm'>
                                    Need help? Contact us at{' '}
                                    <a href="mailto:lp.hatton.sup@gmail.com" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                        lp.hatton.sup@gmail.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="text-center mt-6 text-sm text-gray-500">
                        <p>🔒 Your prescription is secure and confidential</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadSuccessPage;