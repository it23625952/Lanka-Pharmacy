import React, { useState } from 'react';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import LiveChatSystem from './LiveChatSystem';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl border transition-all duration-200 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[32rem]'
    }`}>
      {/* Widget Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Live Support</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-blue-700 p-1 rounded"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-blue-700 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Widget Content */}
      {!isMinimized && (
        <div className="h-[calc(100%-4rem)] overflow-hidden">
          <LiveChatSystem standalone={false} />
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
