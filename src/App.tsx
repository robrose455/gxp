import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './Pages/HomePage';
import MatchDashboard from './Pages/MatchDashboard';

function App() {

  const [activeMatch, setActiveMatch] = useState(null);
  const [accountId, setAccountId] = useState("");

  return (
    <div className="App">
      { activeMatch === null ? <HomePage setActiveMatch={setActiveMatch} setAccountId={setAccountId} /> : <MatchDashboard activeMatch={activeMatch} accountId={accountId} />}
    </div>
  );
}

export default App;
