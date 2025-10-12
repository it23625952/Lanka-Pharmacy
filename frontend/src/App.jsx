import React from 'react';
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';

/**
 * Main application component defining the routing structure
 */
const App = () => {
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App;