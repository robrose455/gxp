import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ChampionImage from '../Components/ChampionImage/ChampionImage';
import MatchContext from '../Components/MatchContext/MatchContext';
import TimelineGraph from '../Components/TimelineGraph/TimelineGraph';
import { Metric, Mode } from '../constants';
import { getMatchData, getMatchPreview } from '../riot.api';
import { MatchData, Event, Data, MatchPreview, ActivePlayer, MetricData } from '../types';
import './MatchDashboard.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MatchDashboard = () => {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // Query Parameters
    const accountId = searchParams.get('accountId') || "";
    const accountName = searchParams.get('accountName') || "";
    const matchId = searchParams.get('matchId') || "";
    
    const [matchPreviewData, setMatchPreviewData] = useState<MatchPreview>({} as MatchPreview);
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
        navigate('/')
    }

    const handleMatchSelect = (match: MatchPreview) => {
        if (match) {
            // setActiveMatch(match)
            // Replace this with addition of changing of URL params & reload
        }
    }

    const fetchMatchData = async () => {

        const mpd = await getMatchPreview(matchId, accountId);
        const matchData = await getMatchData(matchId, accountId);

        if (matchData && matchData.events) {
            const events = matchData.events;
            setActiveEvents(events);
            setMatchData(matchData);
            setMatchPreviewData(mpd);
        }
    }

    useEffect(() => {

        if (matchId && accountId) {
            setMatchDataLoading(true);
            fetchMatchData();
            setMatchDataLoading(false);
        }
        
    }, [matchId, accountId])


    useEffect(() => {

        // On Match Data Load - Set Initial Players & Role based off user
        if (matchData && matchPreviewData) {

            const initialActiveRoles = [matchPreviewData.role];

            setActiveRoles(initialActiveRoles);

            const initialActiveAllyPlayer: ActivePlayer = {
                id: matchPreviewData.playerParticipantId,
                champion: matchPreviewData.playerChampion,
                role: matchPreviewData.role,
                team: 'ally'
            }

            setActiveAllyPlayers([initialActiveAllyPlayer]);

            const initialActiveEnemyPlayer: ActivePlayer = {
                id: matchPreviewData.enemyParticipantId,
                champion: matchPreviewData.enemyChampion,
                role: matchPreviewData.role,
                team: 'enemy'
            }

            setActiveEnemyPlayers([initialActiveEnemyPlayer]);

        }

    }, [matchData, matchPreviewData])
    
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
                        <h3>{accountName}</h3>
                    </div>
                </div>
                <div className="dashboard-main-title">
                    <span className="gold">G</span>XP
                </div>
            </div>
            <div className="dashboard-sub-container">
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
