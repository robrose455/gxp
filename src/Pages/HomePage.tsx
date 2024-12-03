import './HomePage.css'
import AccountSelect from '../Components/AccountSelect/AccountSelect';
import MatchList from '../Components/MatchList';
import { useState, Dispatch, SetStateAction } from 'react';
import { CircularProgress } from '@mui/material';
import { MatchData, MatchPreview } from '../types';


interface HomePageProps {
    setActiveMatch: Dispatch<SetStateAction<MatchPreview>>;
    setAccountId: Dispatch<SetStateAction<string>>;
    setAccountDisplay: Dispatch<SetStateAction<string>>;
    setMatchPreviews: Dispatch<SetStateAction<MatchPreview[]>>;
    matchPreviews: MatchPreview[];
}

const HomePage: React.FC<HomePageProps> = ({ setActiveMatch, setAccountId, setMatchPreviews, setAccountDisplay, matchPreviews }) => {

    const [loading, setLoading] = useState<boolean>(false);

    return (
        <div className="main-container">
            <div className="sub-container">
                <div className="main-title">
                    <span className="gold">G</span>XP
                </div>
                <div className="account-select-container">
                    <AccountSelect 
                        setMatchPreviews={setMatchPreviews} 
                        setLoading={setLoading} loading={loading} 
                        setAccountId={setAccountId} 
                        setAccountDisplay={setAccountDisplay}
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
