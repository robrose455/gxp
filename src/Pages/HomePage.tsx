import './HomePage.css'
import AccountSelect from '../Components/AccountSelect/AccountSelect';
import MatchList from '../Components/MatchList';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { MatchPreview } from '../types';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {

    const navigate = useNavigate();

    const [activeMatch, setActiveMatch] = useState<MatchPreview>({} as MatchPreview);
    const [accountId, setAccountId] = useState<string>("");
    const [accountDisplay, setAccountDisplay] = useState<string>("");
    const [matchPreviews, setMatchPreviews] = useState<MatchPreview[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleRetry = () => {
        setError(false);
    }

    useEffect(() => {

        if (activeMatch && accountId && accountDisplay) {

            const queryParams = new URLSearchParams({
                accountId,
                accountName: accountDisplay,
                matchId: activeMatch.matchId,
            })

            navigate(`/dashboard?${queryParams.toString()}`)

        }
    }, [activeMatch])

    return (
        <div className="main-container">
            <div className="sub-container">
                <div className="main-title">
                    <span className="gold">G</span>XP
                </div>
                <div className="account-select-container">
                    <AccountSelect 
                        setMatchPreviews={setMatchPreviews} 
                        setLoading={setLoading}
                        setAccountId={setAccountId} 
                        setAccountDisplay={setAccountDisplay}
                        error={error}
                        setError={setError}
                    />
                </div>
                { loading ? 
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                        <span style={{ marginTop: '25px' }}>Loading...</span>
                    </div>
                    :
                    <div className="match-list">
                        <MatchList matchPreviews={matchPreviews} setActiveMatch={setActiveMatch} />
                    </div>
                }
            </div>
        </div>
    )
}

export default HomePage
