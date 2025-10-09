import React from 'react';
import { Clock } from "lucide-react";

/**
 * Displays a rate limit warning UI when the user has made too many requests.
 * Provides clear feedback about the temporary restriction and expected wait time
 * using custom yellow-themed styling for better visual hierarchy.
 * 
 * @returns {JSX.Element} The rendered rate limit notification component
 */
const RateLimitedUI = () => {
  return (
    <div 
      role="alert" 
      className="bg-yellow-50 border border-yellow-200 rounded-xl shadow-lg max-w-2xl mx-auto p-6"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        
        {/* Status icon with vertical alignment adjustment */}
        <Clock className="size-6 text-yellow-600 flex-shrink-0 mt-0.5" />
        
        {/* Main content container */}
        <div className="flex-1">
          
          {/* Alert heading */}
          <h3 className="font-bold text-yellow-800 text-lg mb-2">
            Processing Paused
          </h3>
          
          {/* Primary explanation for the rate limit */}
          <p className="text-yellow-700">
            To maintain system performance, we've temporarily limited your request rate. 
            This is usually due to rapid page refreshing or automated activity.
          </p>
          
          {/* Wait time information with visual indicator */}
          <div className="text-sm text-yellow-600 mt-3">
            <p>⏳ You may retry your request in <strong>approximately 60 seconds</strong>.</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;