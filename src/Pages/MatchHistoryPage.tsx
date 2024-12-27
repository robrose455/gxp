import React from 'react'
import './MatchHistoryPage.css'
import SideNav from '../Components/SideNav/SideNav'
import MatchCard from '../Components/MatchCard/MatchCard'

const MatchHistoryPage = () => {
  return (
    <div className="match-history-main-container">
        <SideNav />
        <div className="match-history-sub-container">
            <span>Example Account #Nutt</span>
            <div className="match-history-content-container">
                <MatchCard />
                <MatchCard />
                <MatchCard />
            </div>
        </div>
    </div>
  )
}

export default MatchHistoryPage