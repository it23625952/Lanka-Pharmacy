import React from 'react';
import { Clock, AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Rate limit warning UI component
 * Displays when user has made too many requests with temporary restriction details
 */
const RateLimitedUI = () => {
  return (
    <div 
      role="alert" 
      className="bg-amber-50 border-2 border-amber-200 rounded-2xl shadow-xl max-w-2xl mx-auto p-8"
      aria-live="polite"
    >
      <div className="flex items-start gap-6">
        
        {/* Status Icon */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-2xl shadow-lg flex-shrink-0">
          <Clock className="size-7 text-white" />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="size-6 text-amber-600" />
            <h3 className="font-bold text-amber-800 text-2xl">
              Processing Paused
            </h3>
          </div>
          
          {/* Description */}
          <p className="text-amber-700 text-lg leading-relaxed mb-6">
            To maintain optimal system performance for all users, we've temporarily limited your request rate. 
            This helps ensure smooth operation and prevents service disruptions.
          </p>
          
          {/* Details Section */}
          <div className="space-y-4">
            
            {/* Wait Time */}
            <div className="flex items-center gap-3 bg-amber-100 border border-amber-300 rounded-xl p-4">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-amber-800 font-semibold text-lg">
                  ⏳ You may retry your request in <strong className="text-amber-900">approximately 60 seconds</strong>
                </p>
              </div>
            </div>
            
            {/* Common Causes */}
            <div className="bg-white border border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-amber-800 text-lg mb-3 flex items-center gap-2">
                <RefreshCw className="size-5" />
                Common Causes:
              </h4>
              <ul className="text-amber-700 space-y-2 text-md">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Rapid page refreshing or navigation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Multiple simultaneous requests
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Automated activity or scripts
                </li>
              </ul>
            </div>
            
            {/* Suggested Actions */}
            <div className="bg-amber-100 border border-amber-300 rounded-xl p-4">
              <h4 className="font-semibold text-amber-800 text-lg mb-2">Suggested Actions:</h4>
              <p className="text-amber-700 text-md">
                Please wait a moment before trying again. If this persists, 
                <strong className="text-amber-800"> try refreshing the page after the wait period</strong>.
              </p>
            </div>
            
          </div>
          
          {/* Support Information */}
          <div className="mt-6 pt-4 border-t border-amber-300">
            <p className="text-amber-600 text-sm text-center">
              Need immediate assistance? Contact support at{' '}
              <a 
                href="mailto:lp.hatton.sup@gmail.com" 
                className="text-amber-700 hover:text-amber-800 font-semibold underline"
              >
                lp.hatton.sup@gmail.com
              </a>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;