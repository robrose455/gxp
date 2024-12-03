import { useState, useEffect } from 'react';
import './App.css';
import HomePage from './Pages/HomePage';
import MatchDashboard from './Pages/MatchDashboard';
import { MatchPreview } from './types';

function App() {

  const [activeMatch, setActiveMatch] = useState<MatchPreview>(() => JSON.parse(localStorage.getItem('activeMatch') as string) || "");
  const [accountId, setAccountId] = useState<string>(() => localStorage.getItem('accountId') || '');
  const [accountDisplay, setAccountDisplay] = useState<string>("");
  const [matchPreviews, setMatchPreviews] = useState<MatchPreview[]>(() => JSON.parse(localStorage.getItem('matchPreviews') as string) as MatchPreview[] || []);

  useEffect(() => {
    localStorage.setItem('activeMatch', JSON.stringify(activeMatch));
  }, [activeMatch])

  useEffect(() => {
    localStorage.setItem('accountId', accountId);
  }, [accountId]);

  useEffect(() => {
    localStorage.setItem('matchPreviews', JSON.stringify(matchPreviews));
  }, [matchPreviews])
  

  return (
    <div className="App">
      { (activeMatch && matchPreviews.length > 0) ? 
        <MatchDashboard 
          activeMatch={activeMatch} 
          setActiveMatch={setActiveMatch}
          setMatchPreviews={setMatchPreviews}
          accountDisplay={accountDisplay}
          accountId={accountId} 
          matchPreviews={matchPreviews}
        />
        : 
        <HomePage 
          setActiveMatch={setActiveMatch} 
          setAccountId={setAccountId}
          setAccountDisplay={setAccountDisplay}
          setMatchPreviews={setMatchPreviews}
          matchPreviews={matchPreviews}
        /> 
      }
    </div>
  );
}

export default App;
