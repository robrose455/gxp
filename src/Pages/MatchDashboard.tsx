import React, { useEffect, useState } from 'react'
import MatchContext from '../Components/MatchContext';
import TimelineGraph from '../Components/TimelineGraph';
import Timeline from '../Components/Timeline';
import { getMatchData } from '../riot.api';
import './MatchDashboard.css';


// Could move these to URL params for router integration to persist state
interface MatchDashboardProps {
    activeMatch: any;
    accountId: any;
}

const MatchDashboard: React.FC<MatchDashboardProps> = ({ activeMatch, accountId }) => {

    const [matchData, setMatchData] = useState<any>(null);
    const [matchDataLoading, setMatchDataLoading] = useState(false);

    // User Inputs
    const [activeAlly, setActiveAlly] = useState('');
    const [activeEnemy, setActiveEnemy] = useState('');
    const [activeMetric, setActiveMetric] = useState('XP');
    const [activeRole, setActiveRole] = useState('Mid');

    // Data
    const [activeAllyDataset, setActiveAllyDataset] = useState([]);
    const [activeEnemyDataset, setActiveEnemyDataset] = useState([]);

    // Events
    const [eventTimeline, setEventTimeline] = useState([]);
    const [activeEvents, setActiveEvents] = useState<any>([]);


    const fetchMatchData = async () => {

        const matchData = await getMatchData(activeMatch['matchId'], accountId);
        setMatchData(matchData);

    }

    useEffect(() => {
        
        if (activeMatch) {
            setMatchDataLoading(true);
            fetchMatchData();
            setMatchDataLoading(false);
        }
        
    }, [activeMatch])

    useEffect(() => {

        if (matchData) {

            const playerId = activeMatch['playerParticipantId'];
            const enemyId = activeMatch['enemyParticipantId'];

            setActiveAlly(playerId);
            setActiveEnemy(enemyId);

        }

    }, [matchData])
    
    useEffect(() => {

        if (matchData && activeAlly && activeEnemy) {

            const datasets = matchData['data'];

            const playerDatasets = datasets.find((dataset: any) => dataset['id'] === activeAlly);

            const enemyDatasets = datasets.find((dataset: any) => dataset['id'] === activeEnemy);

            const allyChampionName = matchData['participants'].find((p: any) => p.id === activeAlly).champion;
            const enemyChampionName = matchData['participants'].find((p: any) => p.id === activeEnemy).champion;

            if (activeMetric === 'XP') {
                setActiveAllyDataset(playerDatasets['xp']);
                setActiveEnemyDataset(enemyDatasets['xp']);
            }

            if (activeMetric === 'GOLD') {
                setActiveAllyDataset(playerDatasets['gold']);
                setActiveEnemyDataset(enemyDatasets['gold']);
            }

            // Filter Events that are relevant to the active ally & enemy
            const filteredEvents = [];

            for (const event of matchData['events']) {

                let isNotable = false;

                // What are relevant events
                if (event['type'] === "kill") {

                    // If Player Died - subtype === activeAlly
                    if (event['subtype'] === activeAlly) {
                        isNotable = true;
                    }
                    // If Player Got a kill - killer === activeAlly
                    if (event['killer'] === activeAlly) {
                        isNotable = true;
                    }

                    if (event['subtype'] === activeEnemy) {
                        isNotable = true;
                    }

                    if (event['killer'] === activeEnemy) {
                        isNotable = true;
                    }

                    if (event['killer'] === activeEnemy && event['subtype'] === activeAlly) {
                        isNotable = true;
                    }

                    if (event['killer'] === activeAlly && event['subtype'] === activeEnemy) {
                        isNotable = true;
                    }
        
                }

                if (event['type'] === "objective") {
                    isNotable = true;
                }

                if (event['type'] === "turret") {

                    if (event['killer'] === activeAlly) {
                        isNotable = true;
                    }

                    if (event['killer'] === activeEnemy) {
                        isNotable = true;
                    }

                }

                if (isNotable) {
                    filteredEvents.push(event);
                }

            }

            setActiveEvents(filteredEvents);



        }
        
        
    }, [activeAlly, activeEnemy, activeMetric])

    return (
        <div className="dashboard-main-container">
            <div className="dashboard-main-title">
                <span className="gold">G</span>XP
            </div>
            <div className="dashboard-sub-container">
                <div className="dashboard-graph-container">
                    <TimelineGraph activeAllyDataset={activeAllyDataset} activeEnemyDataset={activeEnemyDataset} activeMetric={activeMetric} events={activeEvents}/>
                </div>
                <div className="dashboard-right-sub-container">
                    <div className="dashboard-legend">
                        <MatchContext 
                            matchData={matchData} 
                            setActiveMetric={setActiveMetric} 
                            activeAlly={activeAlly} 
                            setActiveAlly={setActiveAlly} 
                            activeEnemy={activeEnemy} 
                            setActiveEnemy={setActiveEnemy} 
                            activeMetric={activeMetric} 
                            setActiveRole={setActiveRole}
                            activeRole={activeRole}
                        />
                    </div>
                    <div className="dashboard-timeline">
                        <Timeline matchData={matchData} events={activeEvents} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MatchDashboard
