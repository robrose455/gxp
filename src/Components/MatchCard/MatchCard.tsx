import React from 'react'
import './MatchCard.css'
import { MatchPreview } from '../../types'
import ChampionImage from '../ChampionImage/ChampionImage'
import { useNavigate, useSearchParams } from 'react-router-dom'

export interface MatchCardProps {
  match: MatchPreview
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {

  const [searchParams] = useSearchParams();

  const accountName = searchParams.get('name') || "";
  const accountTag = searchParams.get('tag') || "";

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard?matchId=${match.matchId}&name=${accountName}&tag=${accountTag}`)
  }

  return (
    <div onClick={handleClick} className={`match-card-main-container ${match.win ? 'win' : 'loss'}`}>
      <div className="match-card-player-champion-container">
        <div className="match-card-player-champion-image">
          <ChampionImage champion={match.playerChampion} />
        </div>
      </div>
        vs
      <div className="match-card-enemy-champion-container">
        <div className="match-card-enemy-champion-image">
          <ChampionImage champion={match.enemyChampion} />
        </div>
      </div>
    </div>
  )

}

export default MatchCard