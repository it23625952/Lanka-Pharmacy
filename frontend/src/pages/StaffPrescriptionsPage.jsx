import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';
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
      
      // Handle different response structures
      const prescriptionsData = response.data.prescriptions || response.data || [];
      console.log('Fetched prescriptions:', prescriptionsData); // Debug log
      setPrescriptions(prescriptionsData);
    } catch (error) {
      console.error('Error getting prescriptions: ', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle prescription verification from PrescriptionModal
  const handleVerifyPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(false);
    setShowVerifyModal(true);
  };

  // Handle prescription rejection from PrescriptionModal
  const handleRejectPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(false);
    setShowRejectModal(true);
  };
  
  const refreshList = () => {
    getPrescriptions(); // Refresh the list
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    // Use populated customer data for search
    const customerName = prescription.customer?.name || '';
    const customerEmail = prescription.customer?.email || '';
    const prescriptionId = prescription._id || '';
    
    const matchesSearch = 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescriptionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle capital letter status values
    const matchesFilter = filter === 'all' || 
                         prescription.status?.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
      <Navbar />

      <div className='flex-1 container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>Prescription Queue</h1>

          <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-auto'>
            <div className='relative w-full sm:w-80 lg:w-96'>
              <input 
                type='text' 
                placeholder='Search by customer name, email, or prescription ID...' 
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
              <option value='all'>All Prescriptions</option>
              <option value='Pending'>Pending</option>
              <option value='Verified'>Verified</option>
              <option value='Rejected'>Rejected</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
            {prescriptions.length === 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">No prescriptions found in system</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  There are no prescriptions in the database. Prescriptions will appear here once customers upload them.
                </p>
                <div className="text-sm text-gray-400">
                  Total prescriptions in database: 0
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Search className="size-12 text-gray-400 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-700">No matching prescriptions</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                <div className="text-sm text-gray-400">
                  Total prescriptions: {prescriptions.length} | Filtered out: {prescriptions.length - filteredPrescriptions.length}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='grid gap-6'>
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