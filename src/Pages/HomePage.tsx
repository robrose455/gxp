import './HomePage.css'
import AccountSelect from '../Components/AccountSelect';
import MatchList from '../Components/MatchList';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { CircularProgress } from '@mui/material';


interface HomePageProps {
    setActiveMatch: Dispatch<SetStateAction<any>>;
    setAccountId: Dispatch<SetStateAction<string>>;
}

const HomePage: React.FC<HomePageProps> = ({ setActiveMatch, setAccountId }) => {

    const [matchPreviews, setMatchPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <div className="main-container">
            <div className="sub-container">
                <div className="main-title">
                    <span className="gold">G</span>XP
                </div>
                <div className="account-select-container">
                    <AccountSelect setMatchPreviews={setMatchPreviews} setLoading={setLoading} loading={loading} setAccountId={setAccountId} />
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
