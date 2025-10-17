import React, { useState, useEffect } from 'react';
import { helpSupportAPI } from '../../services/helpSupportAPI';
import { Phone, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const CallbackSystem = () => {
  const [activeTab, setActiveTab] = useState('request');
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [callbackForm, setCallbackForm] = useState({
    userId: 'CUST123', // ✅ Changed from customerID
    customerName: '',
    phoneNumber: '',
    preferredDate: '',
    preferredTime: '',
    reason: '' // ✅ Changed from description & category combined
  });

  const timeSlots = [
    'Morning (9AM-12PM)',
    'Afternoon (12PM-3PM)',
    'Evening (3PM-6PM)',
    'Night (6PM-9PM)'
  ];

  useEffect(() => {
    if (activeTab === 'history') {
      loadCallbacks();
    }
  }, [activeTab]);

  const loadCallbacks = async () => {
    setLoading(true);
    try {
      const response = await helpSupportAPI.getCustomerCallbacks('CUST123');
      setCallbacks(response.data);
    } catch (error) {
      console.error('Error loading callbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCallback = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await helpSupportAPI.requestCallback(callbackForm);
      alert(`Callback request submitted successfully! Callback ID: ${response.data.callback.callbackID}`);
      
      // Reset form and switch to history
      setCallbackForm({
        userId: 'CUST123',
        customerName: '',
        phoneNumber: '',
        preferredDate: '',
        preferredTime: '',
        reason: ''
      });
      setActiveTab('history');
    } catch (error) {
      alert('Error requesting callback: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Scheduled': return 'text-emerald-600 bg-emerald-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Scheduled': return <Calendar className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Request a Callback</h2>
        <p className="text-gray-600">
          Schedule a phone consultation with our pharmacy experts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('request')}
          className={`px-6 py-3 font-medium text-sm border-b-2 ${
            activeTab === 'request'
              ? 'text-green-600 border-green-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <Phone className="w-4 h-4 inline-block mr-2" />
          Request Callback
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-medium text-sm border-b-2 ${
            activeTab === 'history'
              ? 'text-green-600 border-green-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4 inline-block mr-2" />
          My Callbacks
        </button>
      </div>

      {/* Request Callback Tab */}
      {activeTab === 'request' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmitCallback}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={callbackForm.customerName}
                  onChange={(e) => setCallbackForm({...callbackForm, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={callbackForm.phoneNumber}
                  onChange={(e) => setCallbackForm({...callbackForm, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="+94-789638008"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  min={getTomorrowDate()}
                  value={callbackForm.preferredDate}
                  onChange={(e) => setCallbackForm({...callbackForm, preferredDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <select
                  required
                  value={callbackForm.preferredTime}
                  onChange={(e) => setCallbackForm({...callbackForm, preferredTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Callback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={callbackForm.reason}
                  onChange={(e) => setCallbackForm({...callbackForm, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Please describe what you'd like to discuss during the call, include prescription names, order numbers, or specific health concerns..."
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Requesting...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Request Callback
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Callback History Tab */}
      {activeTab === 'history' && (
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading callbacks...</p>
            </div>
          ) : callbacks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No callbacks requested</h3>
              <p className="text-gray-600 mb-4">You haven't requested any callbacks yet</p>
              <button
                onClick={() => setActiveTab('request')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Request Your First Callback
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {callbacks.map(callback => (
                <div key={callback._id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{callback.callbackID}</h3>
                      <p className="text-sm text-gray-600">{callback.customerName}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(callback.status)}`}>
                      {getStatusIcon(callback.status)}
                      <span className="ml-1">{callback.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Phone:</span>
                      <br />
                      {callback.phoneNumber}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>
                      <br />
                      {new Date(callback.preferredDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span>
                      <br />
                      {callback.preferredTime}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm"><span className="font-medium">Reason:</span> {callback.reason}</p>
                  
                  {callback.notes && (
                    <p className="text-gray-600 text-sm mt-2"><span className="font-medium">Staff Notes:</span> {callback.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Information Section */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Callback Service Information:</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free pharmacy consultations
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Licensed pharmacists available
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Prescription guidance and support
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              24-48 hour response time
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Multiple language support
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Follow-up care coordination
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CallbackSystem;
