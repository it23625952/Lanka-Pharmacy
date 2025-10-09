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
        fetchUserPrescriptions(); // Refresh prescriptions list
        toast.success('Order created successfully!');
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
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
            <Navbar />

            <div className='flex-1 container mx-auto px-4 py-8 max-w-6xl'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3'>
                        My Prescriptions
                    </h1>
                    <p className='text-gray-600 text-lg'>Track and manage your uploaded prescriptions</p>
                    
                    {userEmail && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl max-w-md mx-auto mt-4 p-3">
                            <p className="text-blue-700 text-sm">
                                Tracking prescriptions for: <strong>{userEmail}</strong>
                            </p>
                        </div>
                    )}
                </div>

                {/* Filters and Search */}
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8'>
                    <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-auto'>
                        <div className='relative w-full sm:w-80'>
                            <input 
                                type='text' 
                                placeholder='Search by reference ID...' 
                                className='input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12' 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <button className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200'>
                                <Search className='size-5' />
                            </button>
                        </div>

                        <select 
                            className='select select-lg w-full sm:w-48 border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800' 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value='all'>All Status</option>
                            <option value='Pending'>Pending</option>
                            <option value='Verified'>Verified</option>
                            <option value='Rejected'>Rejected</option>
                        </select>
                    </div>

                    <div className="text-sm text-gray-600">
                        {prescriptions.length} prescription(s) found
                    </div>
                </div>

                {/* Verified Prescriptions Alert */}
                {prescriptions.some(p => p.status === 'Verified' && !p.order) && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="size-5 text-green-600" />
                            <div>
                                <strong className="text-green-800">Ready to Order!</strong>
                                <p className="text-green-700 text-sm">
                                    You have verified prescriptions that can be converted to orders.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Prescriptions List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredPrescriptions.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
                        {prescriptions.length === 0 ? (
                            <div className="space-y-4">
                                <FileText className="size-16 text-gray-400 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-700">No prescriptions found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    You haven't uploaded any prescriptions yet. Upload your first prescription to get started.
                                </p>
                                <a 
                                    href="/upload-prescription" 
                                    className="btn bg-gradient-to-r from-blue-600 to-blue-800 border-none text-white hover:from-blue-700 hover:to-blue-900 px-6 py-3 flex items-center justify-center"
                                >
                                    Upload Prescription
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Search className="size-12 text-gray-400 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-700">No matching prescriptions</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='grid gap-6'>
                        {filteredPrescriptions.map(prescription => (
                            <CustomerPrescriptionCard 
                                key={prescription._id} 
                                prescription={prescription} 
                                onSelect={handleSelectPrescription}
                                onCreateOrder={prescription.status === 'Verified' && !prescription.order ? handleCreateOrder : null}
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