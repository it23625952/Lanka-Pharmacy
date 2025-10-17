import React, { useState } from 'react';
import { helpSupportAPI } from '../../services/helpSupportAPI';
import { Star, Heart, MessageCircle } from 'lucide-react';

const FeedbackSystem = () => {
  const [feedbackForm, setFeedbackForm] = useState({
    customerID: 'CUST123', // From auth context
    rating: 5,
    category: '',
    feedbackText: '',
    anonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Overall Service Experience',
    'Prescription Processing',
    'Delivery & Shipping',
    'Customer Support',
    'Website & App Experience',
    'Product Quality',
    'Pricing & Insurance',
    'Pharmacy Staff Interaction',
    'Order Accuracy',
    'Other'
  ];

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await helpSupportAPI.submitFeedback(feedbackForm);
      setSubmitted(true);
      
      // Reset form after delay
      setTimeout(() => {
        setSubmitted(false);
        setFeedbackForm({
          customerID: 'CUST123',
          rating: 5,
          category: '',
          feedbackText: '',
          anonymous: false
        });
      }, 3000);
      
    } catch (error) {
      alert('Error submitting feedback: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, size = 'w-8 h-8' }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`${size} transition-colors ${
              star <= rating 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating) => {
    switch(rating) {
      case 1: return 'Very Dissatisfied';
      case 2: return 'Dissatisfied';
      case 3: return 'Neutral';
      case 4: return 'Satisfied';
      case 5: return 'Very Satisfied';
      default: return '';
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <Heart className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">Thank You!</h2>
          <p className="text-green-700 mb-4">
            Your feedback has been submitted successfully. We truly appreciate you taking the time to help us improve our pharmacy services.
          </p>
          <p className="text-sm text-green-600">
            We'll use your insights to serve you better in the future.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <MessageCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Share Your Feedback</h2>
        <p className="text-gray-600">
          Help us improve our pharmacy services by sharing your experience
        </p>
      </div>

      {/* Feedback Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmitFeedback}>
          
          {/* Rating Section */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              How satisfied are you with our service?
            </label>
            <div className="flex flex-col items-center space-y-4">
              <StarRating 
                rating={feedbackForm.rating}
                onRatingChange={(rating) => setFeedbackForm({...feedbackForm, rating})}
                size="w-10 h-10"
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{feedbackForm.rating}/5</div>
                <div className="text-sm text-gray-600">{getRatingText(feedbackForm.rating)}</div>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What aspect would you like to comment on? *
            </label>
            <select
              required
              value={feedbackForm.category}
              onChange={(e) => setFeedbackForm({...feedbackForm, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Feedback Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please share your detailed feedback *
            </label>
            <textarea
              required
              rows={5}
              value={feedbackForm.feedbackText}
              onChange={(e) => setFeedbackForm({...feedbackForm, feedbackText: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Tell us about your experience, what we did well, and how we can improve..."
            />
          </div>

          {/* Anonymous Option */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={feedbackForm.anonymous}
                onChange={(e) => setFeedbackForm({...feedbackForm, anonymous: e.target.checked})}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-700">Submit feedback anonymously</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting Feedback...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>

      {/* Benefits Section */}
      <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-emerald-900 mb-3">Your feedback helps us:</h3>
        <ul className="space-y-2 text-sm text-emerald-800">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            Improve prescription processing accuracy and speed
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            Enhance our delivery and customer service experience
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            Better train our pharmacy staff and support team
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            Upgrade our website and mobile app functionality
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            Ensure the highest quality of medications and health products
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FeedbackSystem;
