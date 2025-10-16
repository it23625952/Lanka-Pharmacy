import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  FileText, 
  Phone, 
  Star, 
  Users, 
  Clock, 
  CheckCircle,
  Search,
  Mail,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const supportCategories = [
    {
      title: 'Support Tickets',
      description: 'Submit and track support requests',
      icon: FileText,
      link: '/tickets',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Live Chat',
      description: 'Get instant help from experts',
      icon: MessageCircle,
      link: '/chat',
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Request Callback',
      description: 'Schedule a phone consultation',
      icon: Phone,
      link: '/callback',
      color: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Give Feedback',
      description: 'Help us improve our services',
      icon: Star,
      link: '/feedback',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Agent Dashboard',
      description: 'Manage customer tickets',
      icon: Users,
      link: '/agent',
      color: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      title: 'Staff Dashboard',
      description: 'View analytics and reports',
      icon: Clock,
      link: '/staff',
      color: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ];

  const learnTopics = [
    { title: 'Prescription refill questions', category: 'Prescriptions' },
    { title: 'Order status and tracking', category: 'Orders' },
    { title: 'Delivery and shipping issues', category: 'Delivery' },
    { title: 'Insurance and billing inquiries', category: 'Billing' },
    { title: 'Medication side effects', category: 'Medications' },
    { title: 'Account and login problems', category: 'Account' }
  ];

  const quickStats = [
    { icon: Users, label: 'Happy Customers', value: '10,000+' },
    { icon: Clock, label: 'Avg Response', value: '< 2 min' },
    { icon: CheckCircle, label: 'Resolution Rate', value: '98%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-3">Help Center</h1>
          <p className="text-xl text-blue-100 mb-8">PharmaCare Support & Assistance</p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='What can we help you with? E.g. "prescription" or "order tracking"'
              className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-300 focus:outline-none text-lg"
            />
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-yellow-800">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm font-medium">
            To help us help you better, please log in to your PharmaCare account.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Support Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {supportCategories.map((category) => {
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
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

        {/* Learn Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Learn How to Use PharmaCare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learnTopics.map((topic, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-all border border-gray-100"
              >
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">{topic.title}</p>
                  <p className="text-sm text-gray-500">{topic.category}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all">
              Browse Full FAQ
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Get in Touch Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm">
                Can't find the answer you need? We've got you covered.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Visit the Forums</h3>
              <p className="text-gray-600 text-sm">
                Troubleshoot issues, leave feedback, and join the conversation.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <AlertTriangle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2 text-blue-600">Report a Violation</h3>
              <p className="text-gray-600 text-sm">
                When people don't follow the rules, let us know.
              </p>
            </div>
          </div>
        </div>

        {/* Support Team Section */}
        <div className="bg-gray-100 rounded-xl p-8 text-center">
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-14 h-14 bg-gray-300 rounded-full"></div>
            ))}
          </div>
          <p className="text-gray-600 text-sm">
            The PharmaCare Support Team is here to help around the clock Monday - Friday, with limited support on weekends.
          </p>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mt-8">
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Medical Emergency?</h3>
              <p className="text-red-800 mb-4">
                For medical emergencies, don't wait for support. Call emergency services immediately.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">Emergency: 102</span>
                <span className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold">Pharmacy Hotline: +91-9876543210</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpSupportPage;
