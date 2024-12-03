import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ChampionImage from '../Components/ChampionImage/ChampionImage';
import MatchContext from '../Components/MatchContext/MatchContext';
import TimelineGraph from '../Components/TimelineGraph/TimelineGraph';
import { Metric, Mode } from '../constants';
import { getMatchData } from '../riot.api';
import { MatchData, Event, Data, MatchPreview, ActivePlayer, MetricData } from '../types';
import './MatchDashboard.css';

interface MatchDashboardProps {
    activeMatch: MatchPreview;
    setActiveMatch: Dispatch<SetStateAction<MatchPreview>>;
    setMatchPreviews: Dispatch<SetStateAction<MatchPreview[]>>;
    matchPreviews: MatchPreview[];
    accountId: string;
    accountDisplay: string;
}

const MatchDashboard: React.FC<MatchDashboardProps> = ({ activeMatch, accountId, accountDisplay, matchPreviews, setMatchPreviews, setActiveMatch }) => {

    const [matchData, setMatchData] = useState<MatchData>();
    const [matchDataLoading, setMatchDataLoading] = useState<boolean>(false);

    // User Inputs
    const [activeAllyPlayers, setActiveAllyPlayers] = useState<ActivePlayer[]>([]);
    const [activeEnemyPlayers, setActiveEnemyPlayers] = useState<ActivePlayer[]>([]);
    const [activeRoles, setActiveRoles] = useState<string[]>([]);
    const [activeMarkers, setActiveMarkers] = useState<string[]>([]);

    const [activeMetric, setActiveMetric] = useState<Metric>(Metric.XP);
    const [activeMode, setActiveMode] = useState<Mode>(Mode.ADVANTAGE);

    // Data
    const [activeAllyDatasets, setActiveAllyDatasets] = useState<MetricData[]>([]);
    const [activeEnemyDatasets, setActiveEnemyDatasets] = useState<MetricData[]>([]);

    // Events
    const [activeEvents, setActiveEvents] = useState<Event[]>([]);

    const handleSwitchAccount = () => {
        setMatchData(undefined);
        setMatchPreviews([]);
    }

    const handleMatchSelect = (match: MatchPreview) => {
        if (match) {
            setActiveMatch(match)
        }
    }

    const fetchMatchData = async () => {

        const matchData = await getMatchData(activeMatch.matchId, accountId);

        if (matchData && matchData.events) {
            const events = matchData.events;
            setActiveEvents(events);
            setMatchData(matchData);
        }
    }

    useEffect(() => {

        if (activeMatch && accountId) {
            setMatchDataLoading(true);
            fetchMatchData();
            setMatchDataLoading(false);
        }
        
    }, [activeMatch, accountId])


    useEffect(() => {

        // On Match Data Load - Set Initial Players & Role based off user
        if (matchData && activeMatch) {

            const initialActiveRoles = [activeMatch.role];

            setActiveRoles(initialActiveRoles);

            const initialActiveAllyPlayer: ActivePlayer = {
                id: activeMatch.playerParticipantId,
                champion: activeMatch.playerChampion,
                role: activeMatch.role,
                team: 'ally'
            }

            setActiveAllyPlayers([initialActiveAllyPlayer]);

            const initialActiveEnemyPlayer: ActivePlayer = {
                id: activeMatch.enemyParticipantId,
                champion: activeMatch.enemyChampion,
                role: activeMatch.role,
                team: 'enemy'
            }

            setActiveEnemyPlayers([initialActiveEnemyPlayer]);

        }

    }, [matchData, activeMatch])
    
    useEffect(() => {

        if (
            matchData && 
            activeAllyPlayers && activeAllyPlayers.length > 0 && 
            activeEnemyPlayers && activeEnemyPlayers.length > 0
        ) {

            const datasets = matchData.data;

            const allyDatasets = datasets.filter((dataset: Data) => activeAllyPlayers.some((ally: ActivePlayer) => ally.id === dataset.id));

            const enemyDatasets = datasets.filter((dataset: Data) => activeEnemyPlayers.some((enemy: ActivePlayer) => enemy.id === dataset.id));

            const allyMetricDatasets = allyDatasets.map((dataset: Data) => {

                const metricData: MetricData = {
                    id: dataset.id,
                    metric: activeMetric,
                    data: dataset[activeMetric]
                }
                return metricData;
            })

            const enemyMetricDatasets = enemyDatasets.map((dataset: Data) => {
                const metricData: MetricData = {
                    id: dataset.id,
                    metric: activeMetric,
                    data: dataset[activeMetric]
                }
                return metricData;
            })

            if (allyDatasets && enemyDatasets) {

                setActiveAllyDatasets(allyMetricDatasets);
                setActiveEnemyDatasets(enemyMetricDatasets);

            }
        }
        
        
    }, [activeAllyPlayers, activeEnemyPlayers, activeMetric])

    return (
        <div className="dashboard-main-container">
            <div className="dashboard-header-container">
                <div className="account-container">
                    <div onClick={handleSwitchAccount} className="change-account">
                        Switch Account
                    </div>
                    <div className="active-account-title">
                        <h3>{accountDisplay}</h3>
                    </div>
                </div>
                <div className="dashboard-main-title">
                    <span className="gold">G</span>XP
                </div>
            </div>
            <div className="dashboard-sub-container">
                <div className="match-list-container">
                    {matchPreviews.map((match: MatchPreview) => (
                        <div onClick={() => handleMatchSelect(match)} className={`match-container`}>
                            <div className={`${(match.win === true) ? 'victory' : 'defeat'}`}>
                                <ChampionImage champion={match.playerChampion} />
                            </div>
                            <span className={`${(activeMatch.matchId === match.matchId) ? 'active' : ''}`} style={{ padding: '10px', margin: '4px', height: '50%', display: 'flex', alignItems: 'center' }}>vs</span>
                            <div>
                            <ChampionImage champion={match.enemyChampion} /> 
                            </div>
                        </div>
                    ))}
                </div>
                <div className="dashboard-graph-main-container">
                    { matchData &&
                        <TimelineGraph 
                            activeAllyDatasets={activeAllyDatasets} 
                            activeEnemyDatasets={activeEnemyDatasets}
                            activeRoles={activeRoles} 
                            activeMetric={activeMetric} 
                            activeMode={activeMode}
                            activeMarkers={activeMarkers}
                            events={activeEvents} 
                            matchData={matchData}
                            matchDataLoading={matchDataLoading}
                        /> 
                    }
                </div>
                <div className="dashboard-right-sub-container">
                    <div className="dashboard-legend">
                        { matchData && 
                            <MatchContext 
                                matchData={matchData} 
                                setActiveMetric={setActiveMetric}  
                                activeMetric={activeMetric} 
                                setActiveMode={setActiveMode}
                                activeMode={activeMode}
                                setActiveAllyPlayers={setActiveAllyPlayers}
                                activeAllyPlayers={activeAllyPlayers}
                                setActiveEnemyPlayers={setActiveEnemyPlayers}
                                activeEnemyPlayers={activeEnemyPlayers}
                                setActiveRoles={setActiveRoles}
                                activeRoles={activeRoles}
                                setActiveMarkers={setActiveMarkers}
                                activeMarkers={activeMarkers}
                            />
                        }
                    </div>
                    <div className="dashboard-timeline">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MatchDashboard
