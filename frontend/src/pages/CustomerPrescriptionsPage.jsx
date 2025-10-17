import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search, FileText, ShoppingCart } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import PrescriptionModal from '../components/PrescriptionModal';
import CustomerPrescriptionCard from '../components/CustomerPrescriptionCard';
import CreateOrderModal from '../components/CreateOrderModal';

const CustomerPrescriptionsPage = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserPrescriptions();
        } else {
            setIsLoading(false);
            toast.error('Please sign in to view your prescriptions');
        }
    }, [filter]);

    const fetchUserPrescriptions = async () => {
        try {
            setIsLoading(true);
            
            const url = filter === 'all' 
                ? '/prescriptions/customer/my-prescriptions' 
                : `/prescriptions/customer/my-prescriptions?status=${filter}`;
            
            const response = await api.get(url);
            
            const userPrescriptions = response.data.prescriptions || [];
            setPrescriptions(userPrescriptions);
            
            // Set user email from prescriptions or profile
            if (userPrescriptions.length > 0) {
                setUserEmail(userPrescriptions[0].customer?.email || '');
            } else {
                const profileResponse = await api.get('/users/profile');
                setUserEmail(profileResponse.data.email);
            }
            
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            
            if (error.response?.status === 403) {
                toast.error('You do not have permission to view prescriptions');
            } else if (error.response?.status === 401) {
                toast.error('Please sign in to view your prescriptions');
            } else {
                toast.error('Failed to load your prescriptions');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOrder = (prescription) => {
        setSelectedPrescription(prescription);
        setShowCreateOrderModal(true);
    };

    const handleOrderCreated = () => {
        fetchUserPrescriptions();
        toast.success('Order created successfully!');
    };

    const handleDeletePrescription = (deletedPrescriptionId) => {
        setPrescriptions(prev => prev.filter(p => p._id !== deletedPrescriptionId));
<<<<<<< HEAD
        toast.success('Prescription deleted successfully');
=======
>>>>>>> 3629bc058dd523a30a13d914a487001cb3767493
    };

    const filteredPrescriptions = prescriptions.filter(prescription => {
        const customerName = prescription.customer?.name || '';
        const prescriptionId = prescription._id || '';
        
        const matchesSearch = 
            customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prescriptionId.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filter === 'all' || 
                            prescription.status?.toLowerCase() === filter.toLowerCase();
        
        return matchesSearch && matchesFilter;
    });

    const handleSelectPrescription = (prescription) => {
        setSelectedPrescription(prescription);
        setShowPrescriptionModal(true);
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <Navbar />

            <div className='flex-1 container mx-auto px-4 py-8 max-w-7xl'>
                {/* Header Section */}
                <div className='text-center mb-12'>
                    <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
                        My Prescriptions
                    </h1>
                    <p className='text-gray-600 text-xl'>Track and manage your uploaded prescriptions</p>
                    
                    {userEmail && (
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl max-w-md mx-auto mt-6 p-4">
                            <p className="text-emerald-700 text-lg">
                                Tracking prescriptions for: <strong>{userEmail}</strong>
                            </p>
                        </div>
                    )}
                </div>

                {/* Search and Filter Controls */}
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12'>
                    <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-auto'>
                        <div className='relative w-full sm:w-96'>
                            <input 
                                type='text' 
                                placeholder='Search by reference ID or name...' 
                                className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 bg-white rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 text-lg' 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search className='size-6' />
                            </div>
                        </div>

                        <select 
                            className='w-full sm:w-48 py-4 border-2 border-gray-200 bg-white rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 text-gray-800 text-lg px-4'
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value='all'>All Status</option>
                            <option value='Pending'>Pending</option>
                            <option value='Verified'>Verified</option>
                            <option value='Rejected'>Rejected</option>
                        </select>
                    </div>

                    <div className="text-lg text-gray-600 bg-white px-4 py-2 rounded-xl border-2 border-gray-200">
                        {prescriptions.length} prescription(s) found
                    </div>
                </div>

                {/* Verified Prescriptions Alert */}
                {prescriptions.some(p => p.status === 'Verified' && !p.order) && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-center gap-4">
                            <ShoppingCart className="size-8 text-green-600" />
                            <div>
                                <strong className="text-green-800 text-xl">Ready to Order!</strong>
                                <p className="text-green-700 text-lg">
                                    You have verified prescriptions that can be converted to orders.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Prescriptions List */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredPrescriptions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
                        {prescriptions.length === 0 ? (
                            <div className="space-y-6">
                                <FileText className="size-24 text-gray-400 mx-auto" />
                                <h3 className="text-2xl font-semibold text-gray-700">No prescriptions found</h3>
                                <p className="text-gray-500 text-lg max-w-md mx-auto">
                                    You haven't uploaded any prescriptions yet. Upload your first prescription to get started.
                                </p>
                                <a 
                                    href="/upload-prescription" 
                                    className="btn bg-gradient-to-r from-emerald-600 to-emerald-700 border-none text-white hover:from-emerald-700 hover:to-emerald-800 px-8 py-4 text-lg rounded-2xl inline-flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <FileText className="size-5" />
                                    Upload Prescription
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Search className="size-16 text-gray-400 mx-auto" />
                                <h3 className="text-2xl font-semibold text-gray-700">No matching prescriptions</h3>
                                <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='grid gap-8'>
                        {filteredPrescriptions.map(prescription => (
                            <CustomerPrescriptionCard 
                                key={prescription._id} 
                                prescription={prescription} 
                                onSelect={handleSelectPrescription}
                                onCreateOrder={prescription.status === 'Verified' && !prescription.order ? handleCreateOrder : null}
                                onDelete={handleDeletePrescription}
                            />
                        ))}
                    </div>
                )}

                {/* Prescription Detail Modal */}
                <PrescriptionModal
                    prescription={selectedPrescription}
                    isOpen={showPrescriptionModal}
                    onClose={() => {
                        setShowPrescriptionModal(false);
                        setSelectedPrescription(null);
                    }}
                    onVerify={null}
                    onReject={null}
                />

                {/* Create Order Modal */}
                <CreateOrderModal
                    prescription={selectedPrescription}
                    isOpen={showCreateOrderModal}
                    onClose={() => {
                        setShowCreateOrderModal(false);
                        setSelectedPrescription(null);
                    }}
                    onSuccess={handleOrderCreated}
                />
            </div>
        </div>
    );
};

export default CustomerPrescriptionsPage;