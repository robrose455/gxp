import { useState, useEffect } from 'react';
import './App.css';
import HomePage from './Pages/HomePage';
import MatchDashboard from './Pages/MatchDashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TrendPage from './Pages/TrendPage';
import BreakdownPage from './Pages/BreakdownPage';
import MatchHistoryPage from './Pages/MatchHistoryPage';

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage /> 
            }
          />
          <Route
            path="/dashboard"
            element={
              <MatchDashboard />
            }
          />
          <Route
            path="/trends"
            element={
              <TrendPage />
            }
          />
          <Route
            path="/breakdown"
            element={
              <BreakdownPage />
            }
          />
          <Route
            path="/match-history"
            element={
              <MatchHistoryPage />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
