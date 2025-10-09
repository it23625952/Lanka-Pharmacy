import React from 'react';
import Navbar from '../components/Navbar';
import { CheckCircle, Mail, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const UploadSuccessPage = () => {
    const location = useLocation();
    const { prescriptionId, status } = location.state || {};

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
            <Navbar />

            <div className='flex-1 flex items-center justify-center p-4 py-12'>
                <div className='w-full max-w-lg text-center'>
                    <div className='bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
                        <div className='bg-gradient-to-r from-green-500 to-green-600 p-8'>
                            <CheckCircle className='size-20 text-white mx-auto mb-4' />
                            <h2 className='text-3xl font-bold text-white mb-3'>Prescription Uploaded Successfully!</h2>
                        </div>
                        
                        <div className='p-8'>
                            <div className='space-y-4 mb-8'>
                                <div className='flex items-center gap-3 justify-center text-gray-700 text-lg'>
                                    <Clock className='size-5 text-blue-600' />
                                    <span>Status: <strong className='capitalize text-gray-800'>{status || 'Pending'}</strong></span>
                                </div>

                                {prescriptionId && (
                                    <div className='flex items-center gap-3 justify-center text-gray-700 text-lg'>
                                        <Mail className='size-5 text-blue-600' />
                                        <span>Reference ID: <strong className='text-gray-800'>{prescriptionId}</strong></span>
                                    </div>
                                )}
                            </div>

                            <div className='space-y-4 mb-8'>
                                <p className='text-gray-600 text-lg'>Your prescription has been received and is waiting for verification by our pharmacy staff.</p>
                                <p className='text-gray-500 text-md'>You'll receive an email once your medications are ready to be added to cart.</p>
                            </div>

                            <div className='flex gap-4 justify-center mt-8'>
                                <Link 
                                    to='/' 
                                    className='btn bg-gradient-to-r from-green-500 to-green-600 border-none text-white hover:from-green-600 hover:to-green-700 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center min-h-[52px]'
                                >
                                    Return to Home
                                </Link>
                                <Link 
                                    to='/upload-prescription' 
                                    className='btn border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 px-8 py-3 text-lg transition-all duration-200 flex items-center justify-center min-h-[52px]'
                                >
                                    Upload Another
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadSuccessPage;