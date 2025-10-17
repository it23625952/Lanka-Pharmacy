import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  FileText, 
  Phone, 
  Star, 
  CheckCircle,
  Search,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Shield
} from 'lucide-react';
import api from '../lib/axios';


const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showNoResults, setShowNoResults] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch user data from API (not localStorage)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await api.get('/users/profile');
        setUserData(response.data);
        console.log('🔍 User Data from API:', response.data); // DEBUG
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage if API fails
        const user = JSON.parse(localStorage.getItem('user'));
        setUserData(user);
        console.log('🔍 User Data from LocalStorage:', user); // DEBUG
      }
    };

    fetchUserData();
  }, []);


  const supportCategories = [
    {
      title: 'Support Tickets',
      description: 'Submit and track support requests',
      icon: FileText,
      link: '/help-support/tickets',
      color: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      keywords: ['ticket', 'support', 'request', 'issue', 'problem', 'complaint', 'help', 'submit', 'track']
    },
    {
      title: 'Live Chat',
      description: 'Get instant help from experts',
      icon: MessageCircle,
      link: '/help-support/chat',
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      keywords: ['chat', 'live', 'talk', 'message', 'instant', 'speak', 'contact', 'agent', 'online']
    },
    {
      title: 'Request Callback',
      description: 'Schedule a phone consultation',
      icon: Phone,
      link: '/help-support/callback',
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      keywords: ['callback', 'call', 'phone', 'schedule', 'consultation', 'speak', 'talk', 'appointment', 'ring']
    },
    {
      title: 'Give Feedback',
      description: 'Help us improve our services',
      icon: Star,
      link: '/help-support/feedback',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      keywords: ['feedback', 'review', 'rating', 'suggest', 'improve', 'comment', 'opinion', 'experience', 'rate']
    }
  ];

  // ✅ STAFF/ADMIN DASHBOARD CARDS - Only for authorized users
  const staffDashboards = [];
  
  // Staff Dashboard - For Owner, Manager, Staff
  if (userData?.role && ['Owner', 'Manager', 'Staff'].includes(userData.role)) {
    staffDashboards.push({
      title: 'Staff Dashboard',
      description: 'Manage tickets, orders, and operations',
      icon: LayoutDashboard,
      link: '/staff/dashboard',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      keywords: []
    });
  }
  
  // ✅ Agent Dashboard - For Staff, Manager, Owner, AND Support Agent
  if (userData?.role && ['Owner', 'Manager', 'Staff', 'Support Agent'].includes(userData.role)) {
    staffDashboards.push({
      title: 'Agent Dashboard',
      description: 'Handle support tickets and chats',
      icon: Shield,
      link: '/agent/dashboard',
      color: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      keywords: []
    });
  }

  // Combine staff dashboards with support categories
  const allCategories = [...staffDashboards, ...supportCategories];


  const learnTopics = [
    { 
      title: 'Prescription refill questions', 
      category: 'Prescriptions',
      answer: 'To refill a prescription, log in to your account, go to "My Prescriptions" and click "Request Refill". You can also upload a new prescription from your doctor. Refills typically take 24-48 hours to process.'
    },
    { 
      title: 'Order status and tracking', 
      category: 'Orders',
      answer: 'Track your order by going to "My Orders" in your account. You\'ll receive SMS and email updates at each stage. Orders typically arrive within 2-5 business days depending on your location.'
    },
    { 
      title: 'Delivery and shipping issues', 
      category: 'Delivery',
      answer: 'If you experience delivery issues, first check your tracking number. For missing packages, contact our support team within 48 hours. We offer free reshipment for lost orders and expedited shipping for urgent medications.'
    },
    { 
      title: 'Insurance and billing inquiries', 
      category: 'Billing',
      answer: 'We accept most major insurance plans. Upload your insurance card in "My Account" settings. For billing questions, contact our billing department at billing@lankapharmacy.com or call +94 51 222 5523.'
    },
    { 
      title: 'Medication side effects', 
      category: 'Medications',
      answer: 'Always read the medication information leaflet provided. Common side effects are listed there. For serious or unexpected side effects, contact your doctor immediately. Our pharmacists are available 24/7 for medication questions.'
    },
    { 
      title: 'Account and login problems', 
      category: 'Account',
      answer: 'Reset your password using the "Forgot Password" link on the login page. If you still can\'t access your account, contact support with your registered email address. Ensure your browser allows cookies and isn\'t blocking scripts.'
    }
  ];


  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    
    const results = allCategories.filter(category => {
      if (category.title.toLowerCase().includes(query)) return true;
      if (category.description.toLowerCase().includes(query)) return true;
      return category.keywords.some(keyword => 
        keyword.includes(query) || query.includes(keyword)
      );
    });

    if (results.length === 1) {
      navigate(results[0].link);
    } else if (results.length > 1) {
      setSearchResults(results);
      setShowNoResults(false);
    } else {
      setSearchResults(null);
      setShowNoResults(true);
      setTimeout(() => {
        setShowNoResults(false);
      }, 5000);
    }
  };


  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowNoResults(false);
  };


  const toggleTopic = (index) => {
    setExpandedTopic(expandedTopic === index ? null : index);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-3">Help Center</h1>
          <p className="text-xl text-emerald-100 mb-8">Lanka Pharmacy Support & Assistance</p>
          
          {/* Search Bar with Submit */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='What can we help you with? E.g. "ticket" or "chat"'
              className="w-full pl-12 pr-12 py-4 text-gray-900 rounded-lg shadow-lg focus:ring-2 focus:ring-emerald-300 focus:outline-none text-lg"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      </div>


      {/* Notice Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-yellow-800">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm font-medium">
            To help us help you better, please log in to your Lanka Pharmacy account.
          </p>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* No Results Message */}
        {showNoResults && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-pulse">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-red-900 mb-2">No Results Found</h3>
            <p className="text-red-700 mb-4">
              We couldn't find anything matching "<strong>{searchQuery}</strong>"
            </p>
            <p className="text-red-600 text-sm mb-4">
              Try searching for: <strong>tickets, chat, callback, or feedback</strong>
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Clear Search
            </button>
          </div>
        )}


        {/* Filtered Search Results */}
        {searchResults && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
              <button
                onClick={clearSearch}
                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Clear Search
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.title}
                    to={category.link}
                    className="group"
                  >
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200 border-2 border-emerald-500 h-full">
                      <div className={`${category.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`w-8 h-8 ${category.iconColor}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}


        {/* Support Categories Grid - Show all if no search */}
        {!searchResults && !showNoResults && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Can We Help You?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {allCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.title}
                    to={category.link}
                    className="group"
                  >
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-200 border border-gray-100 h-full">
                      <div className={`${category.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`w-8 h-8 ${category.iconColor}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}


        {/* Learn Section with Expandable Topics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Learn How to Use Lanka Pharmacy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learnTopics.map((topic, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  onClick={() => toggleTopic(index)}
                  className="flex items-start justify-between gap-3 p-4 hover:bg-emerald-50 cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900 font-medium">{topic.title}</p>
                      <p className="text-sm text-gray-500">{topic.category}</p>
                    </div>
                  </div>
                  {expandedTopic === index ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
                
                {/* Expanded Answer */}
                {expandedTopic === index && (
                  <div className="px-4 pb-4 pt-2 bg-emerald-50 border-t border-emerald-100 animate-fade-in">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {topic.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* Emergency Contact */}
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Medical Emergency?</h3>
              <p className="text-red-800 mb-4">
                For medical emergencies, don't wait for support. Call emergency services immediately.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">Emergency: 102</span>
                <span className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold">Pharmacy Hotline: +94 51 222 5523</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


export default HelpSupportPage;
