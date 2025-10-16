import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Help & Support imports
import HelpSupportPage from '../pages/HelpsupportPage';
import TicketsPage from '../pages/TicketsPage';
import ChatPage from '../pages/ChatPage';
import CallbackPage from '../pages/CallbackPage';
import FeedbackPage from '../pages/FeedbackPage';
import AgentDashboardPage from '../pages/AgentDashboardPage';
import StaffDashboardPage from '../pages/StaffDashboardPage';

const HelpSupportRoutes = () => {
  return (
    <>
      {/* Routes */}
      <Routes>
        <Route path="/help" element={<HelpSupportPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/agent" element={<AgentDashboardPage />} />
        <Route path="/staff" element={<StaffDashboardPage />} />
      </Routes>
    </>
  );
};

export default HelpSupportRoutes;
