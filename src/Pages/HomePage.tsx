import './HomePage.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountSelect from '../Components/AccountSelect/AccountSelect';


const HomePage = () => {

    const navigate = useNavigate();

    const [accountName, setAccountName] = useState<string>("");
    const [accountTag, setAccountTag] = useState<string>("");

    useEffect(() => {

        if (accountName && accountTag) {

            const queryParams = new URLSearchParams({
                name: accountName,
                tag: accountTag,
            })

            navigate(`/match-history?${queryParams.toString()}`)

        }
    }, [accountName, accountTag])

    return (
        <div className="main-container">
            <div className="sub-container">
                <div className="main-title">
                    <span className="gold">G</span>XP
                </div>
                <div className="account-select-container">
                    <AccountSelect 
                        setAccountName={setAccountName}
                        setAccountTag={setAccountTag}
                    />
                </div>
            </div>
        </div>
    )
}

export default HomePage
