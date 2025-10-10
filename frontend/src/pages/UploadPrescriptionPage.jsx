import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Upload, FileText, User, Mail, Phone, ArrowLeft } from 'lucide-react';
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
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }
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

    if (!isLoggedIn) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJ2MmgtMnptMCA0aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
            
            <Navbar />

            <div className='flex-1 container mx-auto px-4 py-8 max-w-4xl relative z-10'>
                {/* Back Navigation */}
                <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors duration-200">
                    <ArrowLeft className="size-5" />
                    <span className="font-medium">Back to Home</span>
                </Link>

                {/* Page Header */}
                <div className='text-center mb-12'>
                    <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
                        Upload Prescription
                    </h1>
                    <p className='text-gray-600 text-xl'>Upload your prescription for verification and processing</p>
                </div>

                {/* Main Upload Form */}
                <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
                    {/* Form Header */}
                    <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-10'>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
                                <Upload className="size-8 text-white" />
                            </div>
                            <div>
                                <h2 className='text-3xl font-bold text-white'>Prescription Upload</h2>
                                <p className='text-emerald-100 mt-2'>Secure and confidential processing</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Content */}
                    <div className='p-8'>
                        <form onSubmit={handleSubmit} className='space-y-8'>
                            {/* User Information */}
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                                <h3 className="font-semibold text-emerald-800 text-lg mb-4 flex items-center gap-3">
                                    <User className="size-5" />
                                    Uploading As
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-emerald-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
                                            <User className="size-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-emerald-600">Name</p>
                                            <p className="font-semibold">{userProfile?.name || 'Loading...'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
                                            <Mail className="size-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-emerald-600">Email</p>
                                            <p className="font-semibold">{userProfile?.email || 'Loading...'}</p>
                                        </div>
                                    </div>
                                    {userProfile?.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
                                                <Phone className="size-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-emerald-600">Phone</p>
                                                <p className="font-semibold">{userProfile.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Prescription Upload */}
                            <div className='space-y-4'>
                                <label className='text-lg font-semibold text-gray-700 flex items-center gap-3'>
                                    <FileText className='size-5 text-emerald-600' />
                                    Prescription Image *
                                </label>
                                
                                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                                    previewUrl 
                                        ? 'border-emerald-300 bg-emerald-50' 
                                        : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50'
                                }`}>
                                    <input
                                        type='file'
                                        className='hidden'
                                        id='prescriptionImage'
                                        accept='image/*,.pdf'
                                        onChange={handleImageChange}
                                    />
                                    
                                    {previewUrl ? (
                                        <div className='space-y-6'>
                                            <div className="relative inline-block">
                                                <img 
                                                    src={previewUrl} 
                                                    alt='Prescription preview' 
                                                    className='max-h-80 rounded-2xl shadow-lg mx-auto'
                                                />
                                                <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                    Preview
                                                </div>
                                            </div>
                                            <div className="flex gap-4 justify-center">
                                                <label 
                                                    htmlFor='prescriptionImage'
                                                    className='px-6 py-3 border-2 border-emerald-600 text-emerald-600 bg-white hover:bg-emerald-50 rounded-xl font-semibold transition-all duration-200 cursor-pointer'
                                                >
                                                    Change Image
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPrescriptionImage(null);
                                                        setPreviewUrl('');
                                                    }}
                                                    className='px-6 py-3 border-2 border-gray-400 text-gray-600 bg-white hover:bg-gray-50 rounded-xl font-semibold transition-all duration-200'
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label htmlFor='prescriptionImage' className='cursor-pointer block'>
                                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Upload className='size-8 text-white' />
                                            </div>
                                            <p className='text-gray-700 text-lg mb-2 font-semibold'>Click to upload prescription</p>
                                            <p className='text-gray-500 text-sm'>Supports JPG, PNG, PDF (Max 5MB)</p>
                                            <p className='text-gray-400 text-xs mt-2'>Your prescription will be securely processed</p>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className='space-y-4'>
                                <label className='block text-lg font-semibold text-gray-700'>
                                    Additional Notes
                                </label>
                                <div className="relative">
                                    <textarea
                                        className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none'
                                        rows={4}
                                        placeholder='Any special instructions, dosage details, or notes for our pharmacy team...'
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                    <div className="absolute left-4 top-4 text-gray-400">
                                        <FileText className="size-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className='pt-6 border-t border-gray-200'>
                                <button 
                                    type='submit' 
                                    className='w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                                    disabled={isLoading || !prescriptionImage || isGettingProfile}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Uploading Prescription...</span>
                                        </>
                                    ) : isGettingProfile ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Loading Your Details...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="size-6" />
                                            <span>Upload Prescription</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Process Information */}
                <div className='mt-12 text-center'>
                    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-emerald-600 font-bold text-lg">1</span>
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">Upload Prescription</h4>
                                <p className="text-gray-600 text-sm">Take a clear photo or scan of your prescription</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-emerald-600 font-bold text-lg">2</span>
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">Pharmacy Verification</h4>
                                <p className="text-gray-600 text-sm">Our licensed pharmacists verify your prescription</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-emerald-600 font-bold text-lg">3</span>
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">Ready for Order</h4>
                                <p className="text-gray-600 text-sm">Add verified medications to cart and complete order</p>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-emerald-600 font-semibold text-lg">
                                ✓ You'll receive email notifications at each step
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Typical processing time: 1-2 hours during business hours
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Note */}
                <div className="text-center mt-8 text-gray-600 text-lg">
                    <p>🔒 Your prescription is secure and confidential</p>
                </div>
            </div>
        </div>
    );
};

export default UploadPrescriptionPage;