import { useState, useEffect } from 'react';
import './App.css';
import HomePage from './Pages/HomePage';
import MatchDashboard from './Pages/MatchDashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
