import { useEffect, useState } from 'react'
import MatchContext from '../Components/MatchContext/MatchContext';
import TimelineGraph from '../Components/TimelineGraph/TimelineGraph';
import { Metric, Mode } from '../constants';
import { getMatchData, getMatchPreview } from '../riot.api';
import { MatchData, Event, Data, MatchPreview, ActivePlayer, Dataset } from '../types';
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

    // User Inputs
    const [activeAllyPlayers, setActiveAllyPlayers] = useState<ActivePlayer[]>([]);
    const [activeEnemyPlayers, setActiveEnemyPlayers] = useState<ActivePlayer[]>([]);
    const [activeRoles, setActiveRoles] = useState<string[]>([]);
    const [activeMarkers, setActiveMarkers] = useState<string[]>([]);
    const [activeMetrics, setActiveMetrics] = useState<Metric[]>([Metric.GOLD, Metric.XP]);
    
    const [activeMode, setActiveMode] = useState<Mode>(Mode.ADVANTAGE);

    // Data
    const [activeDatasets, setActiveDatasets] = useState<Dataset[]>([]);

    // Events
    const [activeEvents, setActiveEvents] = useState<Event[]>([]);

    const handleSwitchAccount = () => {
        navigate('/')
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
            fetchMatchData();
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

            const allyDatasets: Data[] = datasets.filter((dataset: Data) => activeAllyPlayers.some((ally: ActivePlayer) => ally.id === dataset.id));

            const enemyDatasets: Data[] = datasets.filter((dataset: Data) => activeEnemyPlayers.some((enemy: ActivePlayer) => enemy.id === dataset.id));

            let activeDatasets: Dataset[] = [];

            for (const metric of activeMetrics) {
                
                const allyMetricDatasets: number[][] = allyDatasets.map((dataset) => {
                    return dataset[metric];
                })

                const enemyMetricDatasets: number[][] = enemyDatasets.map((dataset) => {
                    return dataset[metric];
                })

                const computedDataset: Dataset = {
                    metric,
                    mode: activeMode,
                    data: computeMetricData(allyMetricDatasets, enemyMetricDatasets, metric),
                    display: getDisplayForMetric(metric)
                }

                activeDatasets.push(computedDataset);

            }

            setActiveDatasets(activeDatasets);

        }
        
    }, [activeAllyPlayers, activeEnemyPlayers, activeMetrics, activeMode])

    const computeMetricData = (allyDatasets: number[][], enemyDatasets: number[][], metric: Metric) => {

        console.log(metric);
        console.log(allyDatasets);
        console.log(enemyDatasets);
        const computedMetricData: any[] = [];

            let aggregatedAllyDataset: number[] = [];
            
            for (let i = 0; i < allyDatasets[0].length; i++) {
                let aggregatedDatapoint = 0;
                for (const allyDataset of allyDatasets) {
                    const datapoint = allyDataset[i];
                    aggregatedDatapoint = aggregatedDatapoint + datapoint;
                }
                aggregatedAllyDataset.push(aggregatedDatapoint);
            }

            let aggregatedEnemyDataset: number[] = [];
            
            for (let i = 0; i < enemyDatasets[0].length; i++) {
                let aggregatedDatapoint = 0;
                for (const enemyDataset of enemyDatasets) {
                    const datapoint = enemyDataset[i];
                    aggregatedDatapoint = aggregatedDatapoint + datapoint;
                }
                aggregatedEnemyDataset.push(aggregatedDatapoint);
            }

            // TODO: Reinstate Max Frame Min Frame
            for (let i = 0; i <= allyDatasets[0].length; i++) {

                let computedMetricDataPoint = 0;

                if (activeMode === Mode.GROWTH) {
                    if (aggregatedAllyDataset[i] === 0 || aggregatedEnemyDataset[i + 1] === 0) {
                        computedMetricDataPoint = 0;
                    } else {
                        const allyGrowthRate = ((aggregatedAllyDataset[i + 1] - aggregatedAllyDataset[i]));
                        const enemyGrowthRate = ((aggregatedEnemyDataset[i + 1] - aggregatedEnemyDataset[i])); 
                        computedMetricDataPoint = allyGrowthRate - enemyGrowthRate; // Difference in growth rate percentage
                    }
                }

                if (activeMode === Mode.ADVANTAGE) {

                    if (aggregatedEnemyDataset[i] === 0) {
                        computedMetricDataPoint = 0;
                    } else {
                        computedMetricDataPoint = (((aggregatedAllyDataset[i] - aggregatedEnemyDataset[i])) / aggregatedEnemyDataset[i]) * 100;
                    }
                }

                computedMetricData.push(computedMetricDataPoint);

            }

        console.log(computedMetricData);
        return computedMetricData;

    }

    const getDisplayForMetric = (metric: Metric) => {

        if (metric === Metric.XP) {
            return {
                title: 'XP',
                theme: {
                    borderColor: '#4C6EF5',
                    backgroundColor: 'rgba(76, 110, 245, 0.2)',
                }
            }
        }

        if (metric === Metric.GOLD) {
            return {
                title: 'Gold',
                theme: {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                }
            }
        }

        if (metric === Metric.CS) {
            return {
                title: 'CS',
                theme: {
                    borderColor: '#FF4C4C',
                    backgroundColor: 'rgba(255, 76, 76, 0.2)'
                }
            }
        }

        return {
            title: 'Data',
            theme: {
                borderColor: 'white',
                backgroundColor: 'white'
            }
        }
    }

    return (
        <div className="dashboard-main-container">
            <div className="dashboard-sub-container">
                <div className="dashboard-graph-main-container">
                    { matchData &&
                        <TimelineGraph 
                            activeDatasets={activeDatasets}
                            activeMetrics={activeMetrics} 
                            activeMode={activeMode}
                            activeMarkers={activeMarkers}
                            events={activeEvents} 
                            matchData={matchData}
                        /> 
                    }
                </div>
                <div className="dashboard-right-sub-container">
                    <div className="dashboard-match-context-container">
                        { matchData && 
                            <MatchContext 
                                matchData={matchData} 
                                setActiveMetrics={setActiveMetrics}  
                                activeMetrics={activeMetrics} 
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
