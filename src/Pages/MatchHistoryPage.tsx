import React, { useEffect, useState } from 'react'
import './MatchHistoryPage.css'
import SideNav from '../Components/SideNav/SideNav'
import MatchCard from '../Components/MatchCard/MatchCard'
import { useSearchParams } from 'react-router-dom'
import { getMatchPreviews } from '../riot.api'
import { MatchPreview } from '../types'
import { CircularProgress } from '@mui/material'

const MatchHistoryPage = () => {

  const [searchParams] = useSearchParams();

  const accountName = searchParams.get('name') || "";
  const accountTag = searchParams.get('tag') || "";

  const [matchPreviewDataLoading, setMatchPreviewDataLoading] = useState<boolean>();
  const [matchPreviews, setMatchPreviews] = useState<MatchPreview[]>([])

  const fetchMatchPreviewData = async () => {
        
    setMatchPreviewDataLoading(true);

    const matchPreviewResponse = await getMatchPreviews(accountName, accountTag)

    if (matchPreviewResponse) {
      setMatchPreviews(matchPreviewResponse);
      setMatchPreviewDataLoading(false);
    }

  }

  useEffect(() => {
        
    if (accountName && accountTag) {
        fetchMatchPreviewData();
    }

}, [accountName, accountTag]);

  return (
    <div className="match-history-main-container">
        <SideNav />
        <div className="match-history-sub-container">
              {matchPreviewDataLoading ? 
                <div className="match-history-loading-container">
                  <CircularProgress size={100} style={{ color: 'goldenrod' }} />
                </div> 
                : 
                <div className="match-history-content-container">
                  {matchPreviews.map((match, index) => (
                    <MatchCard match={match} key={index} />
                  ))}
                </div>
              }
        </div>
    </div>
  )
}

export default MatchHistoryPage