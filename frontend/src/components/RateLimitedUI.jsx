import React from 'react';
import { Clock } from "lucide-react";

/**
 * Displays a rate limit warning UI when the user has made too many requests.
 * Uses DaisyUI's alert component for consistent theme integration and provides
 * clear feedback about the temporary restriction and expected wait time.
 * 
 * @returns {JSX.Element} The rendered rate limit notification component
 */
const RateLimitedUI = () => {
  return (
    <div 
      role="alert" 
      className="alert alert-warning bg-warning/10 border-warning/50 shadow-lg max-w-2xl mx-auto"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        
        {/* Status icon with vertical alignment adjustment */}
        <Clock className="size-6 text-warning flex-shrink-0 mt-0.5" />
        
        {/* Main content container */}
        <div className="flex-1">
          
          {/* Alert heading */}
          <h3 className="font-semibold text-warning-content text-lg mb-1">
            Processing Paused
          </h3>
          
          {/* Primary explanation for the rate limit */}
          <p className="text-warning-content/90">
            To maintain system performance, we've temporarily limited your request rate. 
            This is usually due to rapid page refreshing or automated activity.
          </p>
          
          {/* Wait time information with visual indicator */}
          <div className="text-sm text-warning-content/70 mt-2">
            <p>⏳ You may retry your request in <strong>approximately 60 seconds</strong>.</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;