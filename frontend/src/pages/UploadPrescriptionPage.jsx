import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Upload, FileText, LogIn } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router';

const UploadPrescriptionPage = () => {
    const [notes, setNotes] = useState('');
    const [prescriptionImage, setPrescriptionImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [isGettingProfile, setIsGettingProfile] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('token');

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoggedIn) {
            toast.error('Please sign in to upload a prescription');
            navigate('/signin');
            return;
        }
        getUserProfile();
    }, [isLoggedIn, navigate]);

    const getUserProfile = async () => {
        if (!isLoggedIn) return;
        
        setIsGettingProfile(true);
        try {
            const response = await api.get('/users/profile');
            setUserProfile(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Failed to load user information');
        } finally {
            setIsGettingProfile(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPrescriptionImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!prescriptionImage) {
            toast.error('Please select a prescription image');
            return;
        }

        if (!isLoggedIn) {
            toast.error('Please sign in to upload a prescription');
            navigate('/signin');
            return;
        }

        setIsLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('prescriptionImage', prescriptionImage);
            submitData.append('notes', notes);

            const response = await api.post('/prescriptions/upload-prescription', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Prescription uploaded successfully!');
            navigate('/upload-success', { 
                state: { 
                    prescriptionId: response.data.prescription.id,
                    status: response.data.prescription.status 
                } 
            });
        } catch (error) {
            console.error('Upload error:', error);
            if (error.response?.status === 401) {
                toast.error('Please sign in to upload a prescription');
                navigate('/signin');
            } else {
                toast.error(error.response?.data?.message || 'Failed to upload prescription');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking authentication
    if (!isLoggedIn) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
            <Navbar />
            
            <div className='flex-1 container mx-auto px-4 py-8 max-w-4xl'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3'>Upload Prescription</h1>
                    <p className='text-gray-600 text-lg'>Upload your prescription for verification and processing</p>
                    
                    {/* User Info Display */}
                    <div className="bg-green-50 border border-green-200 rounded-xl max-w-md mx-auto mt-6 p-4">
                        <div className="flex items-center gap-3 justify-center">
                            <span className="text-green-700 font-medium">
                                Uploading as: {userProfile?.name || 'Loading...'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
                    <div className='bg-gradient-to-r from-blue-600 to-blue-800 p-6'>
                        <h2 className='text-2xl font-bold text-white'>Prescription Upload</h2>
                    </div>
                    
                    <div className='p-8'>
                        <form onSubmit={handleSubmit} className='space-y-8'>
                            {/* User Information Display */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <h3 className="font-semibold text-blue-800 text-lg mb-3">Uploading as:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
                                    <div>
                                        <strong>Name:</strong> {userProfile?.name || 'Loading...'}
                                    </div>
                                    <div>
                                        <strong>Email:</strong> {userProfile?.email || 'Loading...'}
                                    </div>
                                    {userProfile?.phone && (
                                        <div>
                                            <strong>Phone:</strong> {userProfile.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Prescription Upload */}
                            <div className='form-control'>
                                <label className='label mb-2'>
                                    <span className='label-text font-semibold text-gray-700 text-lg flex items-center gap-3'>
                                        <FileText className='size-5 text-blue-600' />
                                        Prescription Image *
                                    </span>
                                </label>
                                
                                <div className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-all duration-200'>
                                    <input
                                        type='file'
                                        className='hidden'
                                        id='prescriptionImage'
                                        accept='image/*'
                                        onChange={handleImageChange}
                                    />
                                    
                                    {previewUrl ? (
                                        <div className='space-y-6'>
                                            <img 
                                                src={previewUrl} 
                                                alt='Prescription preview' 
                                                className='max-h-80 mx-auto rounded-lg shadow-md'
                                            />
                                            <label 
                                                htmlFor='prescriptionImage'
                                                className='btn border-2 border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 px-6 py-3 transition-all duration-200'
                                            >
                                                Change Image
                                            </label>
                                        </div>
                                    ) : (
                                        <label htmlFor='prescriptionImage' className='cursor-pointer'>
                                            <Upload className='size-16 text-gray-400 mx-auto mb-4' />
                                            <p className='text-gray-600 text-lg mb-2'>Click to upload prescription image</p>
                                            <p className='text-sm text-gray-500'>Supports JPG, PNG (Max 5MB)</p>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className='form-control'>
                                <label className='label mb-2'>
                                    <span className='label-text font-semibold text-gray-700 text-lg'>Additional Notes</span>
                                </label>
                                <textarea
                                    className='textarea textarea-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500'
                                    rows={4}
                                    placeholder='Any special instructions or notes...'
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className='form-control mt-8'>
                                <button 
                                    type='submit' 
                                    className='btn w-full text-lg font-semibold py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 border-none hover:from-blue-700 hover:to-blue-900 text-white transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center min-h-[64px] gap-3'
                                    disabled={isLoading || !prescriptionImage || isGettingProfile}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                            Uploading...
                                        </span>
                                    ) : isGettingProfile ? (
                                        <span className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                            Loading your details...
                                        </span>
                                    ) : (
                                        <>
                                            <Upload className="size-6" />
                                            Upload Prescription
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Process Information */}
                <div className='mt-8 text-center text-gray-600 text-lg'>
                    <p>After upload, our staff will verify your prescription and add the medications to your cart.</p>
                    <p>You'll receive an email notification once your prescription is processed.</p>
                    <p className="mt-3 text-green-600 font-semibold">
                        ✓ You'll be able to track this prescription in your order history.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UploadPrescriptionPage;