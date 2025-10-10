import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search, FileText } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import PrescriptionCard from '../components/StaffPrescriptionCard';
import PrescriptionModal from '../components/PrescriptionModal';
import VerifyPrescriptionModal from '../components/VerifyPrescriptionModal';
import RejectPrescriptionModal from '../components/RejectPrescriptionModal';

const StaffPrescriptionsPage = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getPrescriptions();
    }, [filter]);

    const getPrescriptions = async () => {
        try {
            setIsLoading(true);
            const url = filter === 'all' ? '/prescriptions' : `/prescriptions?status=${filter}`;
            const response = await api.get(url);
            
            const prescriptionsData = response.data.prescriptions || response.data || [];
            setPrescriptions(prescriptionsData);
        } catch (error) {
            console.error('Error getting prescriptions: ', error);
            toast.error('Failed to load prescriptions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyPrescription = (prescription) => {
        setSelectedPrescription(prescription);
        setShowPrescriptionModal(false);
        setShowVerifyModal(true);
    };

    const handleRejectPrescription = (prescription) => {
        setSelectedPrescription(prescription);
        setShowPrescriptionModal(false);
        setShowRejectModal(true);
    };
    
    const refreshList = () => {
        getPrescriptions();
    };

    const filteredPrescriptions = prescriptions.filter(prescription => {
        const customerName = prescription.customer?.name || '';
        const customerEmail = prescription.customer?.email || '';
        const prescriptionId = prescription._id || '';
        
        const matchesSearch = 
            customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prescriptionId.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filter === 'all' || 
                         prescription.status?.toLowerCase() === filter.toLowerCase();
        
        return matchesSearch && matchesFilter;
    });

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <Navbar />

            <div className='flex-1 container mx-auto px-4 py-8 max-w-7xl'>
                {/* Header and Search Section */}
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12'>
                    <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent'>
                        Prescription Queue
                    </h1>

                    <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-auto'>
                        <div className='relative w-full sm:w-96 lg:w-[500px]'>
                            <input 
                                type='text' 
                                placeholder='Search by customer name, email, or prescription ID...' 
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
                            <option value='all'>All Prescriptions</option>
                            <option value='Pending'>Pending</option>
                            <option value='Verified'>Verified</option>
                            <option value='Rejected'>Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredPrescriptions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
                        {prescriptions.length === 0 ? (
                            <div className="space-y-6">
                                <FileText className="size-24 text-gray-400 mx-auto" />
                                <h3 className="text-2xl font-semibold text-gray-700">No prescriptions found in system</h3>
                                <p className="text-gray-500 text-lg max-w-md mx-auto">
                                    There are no prescriptions in the database. Prescriptions will appear here once customers upload them.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <Search className="size-16 text-gray-400 mx-auto" />
                                <h3 className="text-2xl font-semibold text-gray-700">No matching prescriptions</h3>
                                <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
                                <div className="text-lg text-gray-400">
                                    Total prescriptions: {prescriptions.length} | Filtered out: {prescriptions.length - filteredPrescriptions.length}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='grid gap-8'>
                        {filteredPrescriptions.map(prescription => (
                            <PrescriptionCard
                                key={prescription._id} 
                                prescription={prescription} 
                                onUpdate={getPrescriptions} 
                                onSelect={(prescription) => {
                                    setSelectedPrescription(prescription);
                                    setShowPrescriptionModal(true);
                                }}
                                onVerify={handleVerifyPrescription}
                                onReject={handleRejectPrescription}
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
                    onVerify={handleVerifyPrescription}
                    onReject={handleRejectPrescription}
                />

                {/* Verify Prescription Modal */}
                <VerifyPrescriptionModal
                    prescription={selectedPrescription}
                    isOpen={showVerifyModal}
                    onClose={() => {
                        setShowVerifyModal(false);
                        setSelectedPrescription(null);
                    }}
                    onSuccess={refreshList}
                />

                {/* Reject Prescription Modal */}
                <RejectPrescriptionModal
                    prescription={selectedPrescription}
                    isOpen={showRejectModal}
                    onClose={() => {
                        setShowRejectModal(false);
                        setSelectedPrescription(null);
                    }}
                    onSuccess={refreshList}
                />
            </div>
        </div>
    );
};

export default StaffPrescriptionsPage;