import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import './MatchContext.css';
import ChampionImage from '../ChampionImage/ChampionImage';
import { MARKERS, Metric, Mode, ROLES } from '../../constants';
import { ActivePlayer, MatchData, Participant } from '../../types';

 type DisplayRole = {
    role: string,
    allyChampion: string,
    enemyChampion: string,
}

interface MatchContextProps {
    matchData: MatchData;
    setActiveMetrics: Dispatch<SetStateAction<Metric[]>>;
    activeMetrics: Metric[];
    setActiveMode: Dispatch<SetStateAction<Mode>>;
    activeMode: Mode;
    setActiveAllyPlayers: Dispatch<SetStateAction<ActivePlayer[]>>;
    activeAllyPlayers: ActivePlayer[];
    setActiveEnemyPlayers: Dispatch<SetStateAction<ActivePlayer[]>>;
    activeEnemyPlayers: ActivePlayer[];
    setActiveRoles: Dispatch<SetStateAction<string[]>>;
    activeRoles: string[];
    setActiveMarkers: Dispatch<SetStateAction<string[]>>;
    activeMarkers: string[];
}

const MatchContext: React.FC<MatchContextProps> = ({ 
    matchData, 
    setActiveMetrics,  
    activeMetrics,
    setActiveRoles,
    activeRoles,
    setActiveMode,
    activeMode,
    setActiveAllyPlayers,
    activeAllyPlayers,
    setActiveEnemyPlayers,
    activeEnemyPlayers,
    setActiveMarkers,
    activeMarkers
}) => {

    const [displayRoleList, setDisplayRoleList] = useState<DisplayRole[]>([]);
    const [tempActiveMemory, setTempActiveMemory] = useState<any>();
    const [teamToggle, setTeamToggle] = useState<boolean>(false);

    useEffect(() => {

        if (matchData && matchData.participants.length > 0) {

            const participantData: Participant[] = matchData.participants;

            const displayRoleList: DisplayRole[] = [];

            for (const role of ROLES) {

                let displayRole: DisplayRole = {
                    role,
                    allyChampion: "",
                    enemyChampion: ""
                };

                for (const player of participantData) {

                    if (player.role === role) {

                        if (player.team === 'ally') {
                            displayRole.allyChampion = player.champion;
                        }

                        if (player.team === 'enemy') {
                            displayRole.enemyChampion = player.champion;
                        }
                    }
                }

                displayRoleList.push(displayRole);
            }
            
            setDisplayRoleList(displayRoleList);
        }

    }, [matchData])

    useEffect(() => {
        if (activeRoles.length === 5) {
            setTeamToggle(true)
        } else {
            setTeamToggle(false);
        }
    }, [activeRoles])

    const handleMetricClick = (metric: Metric, multiselect: boolean = false) => {

       if (metric) {

            if (multiselect) {
                let activeMetricsBuffer = [...activeMetrics]
                if (activeMetricsBuffer.includes(metric)) {
                    activeMetricsBuffer = activeMetricsBuffer.filter((m) => m !== metric);
                } else {
                    activeMetricsBuffer.push(metric);
                }

                setActiveMetrics(activeMetricsBuffer);
            } else {
                setActiveMetrics([metric])
            }
       }

    }

    const handleModeClick = (mode: Mode) => {
        
        if (mode) {
            setActiveMode(mode)
        }
    }

    const handleRoleClick = (displayRole: DisplayRole, multiselect: boolean = false) => {
        updateActiveRoleAndPlayers(displayRole, multiselect);
    }

    const handleTeamClick = () => {
        activateAllRoleAndPlayers();
    }

    const handleMarkerClick = (marker: string) => {
        updateMarkers(marker);
    }

    const updateMarkers = (marker: string) => {

        let activeMarkersBuffer = [...activeMarkers]
        if (activeMarkersBuffer.includes(marker)) {
            activeMarkersBuffer = activeMarkersBuffer.filter((mark) => mark !== marker);
        } else {
            activeMarkersBuffer.push(marker);
        }

        setActiveMarkers(activeMarkersBuffer);
    }

    const activateAllRoleAndPlayers = () => {

            if (!teamToggle) {

                const tempMemory = {
                    roles: activeRoles,
                    ally: activeAllyPlayers,
                    enemy: activeEnemyPlayers
                }

                setTempActiveMemory(tempMemory);

                setActiveRoles(['Top','Jungle','Mid','ADC','Support']);
                const activeAlly = matchData.participants.filter((player) => player.team === 'ally') as ActivePlayer[];
                setActiveAllyPlayers(activeAlly);
                const activeEnemy = matchData.participants.filter((player) => player.team === 'enemy') as ActivePlayer[];
                setActiveEnemyPlayers(activeEnemy);

                setTeamToggle(true);

            }

            if (teamToggle && tempActiveMemory) {

                setActiveRoles(tempActiveMemory.roles);
                setActiveAllyPlayers(tempActiveMemory.ally);
                setActiveEnemyPlayers(tempActiveMemory.enemy);

                setTeamToggle(false);

            }


    }

    const updateActiveRoleAndPlayers = (displayRole?: DisplayRole, multiselect: boolean = false) => {

        if (displayRole && displayRole.role) {

            let activeRolesBuffer = [...activeRoles];
            
            const newRole = displayRole.role;

            if (activeRolesBuffer.includes(newRole)) {
                activeRolesBuffer = activeRolesBuffer.filter((role: string) => role !== newRole);
            } else {
                if (multiselect) {
                    activeRolesBuffer.push(newRole)
                } else {
                    activeRolesBuffer = [newRole];
                }
            }

            setActiveRoles(activeRolesBuffer);
        }

        if (displayRole && displayRole.allyChampion) {

            let activeAllyPlayersBuffer = [...activeAllyPlayers];

            const newActiveAllyPlayer = matchData.participants.find((participant: Participant) => participant.champion === displayRole.allyChampion ) as ActivePlayer;

            if (activeAllyPlayersBuffer.find((player: ActivePlayer) => player.champion === newActiveAllyPlayer.champion)) {
                activeAllyPlayersBuffer = activeAllyPlayersBuffer.filter((player: ActivePlayer) => player.champion !== newActiveAllyPlayer.champion)
                
            } else {
                if (multiselect) {
                    activeAllyPlayersBuffer.push(newActiveAllyPlayer); 
                } else {
                    activeAllyPlayersBuffer = [newActiveAllyPlayer];
                }
            }

            setActiveAllyPlayers(activeAllyPlayersBuffer);
        }

        if (displayRole && displayRole.enemyChampion) {
            
            let activeEnemyPlayersBuffer = [...activeEnemyPlayers];

            const newActiveEnemyPlayer = matchData.participants.find((participant: Participant) => participant.champion === displayRole.enemyChampion ) as ActivePlayer;

            if (activeEnemyPlayersBuffer.find((player: ActivePlayer) => player.champion === newActiveEnemyPlayer.champion)) {
                activeEnemyPlayersBuffer = activeEnemyPlayersBuffer.filter((player: ActivePlayer) => player.champion !== newActiveEnemyPlayer.champion)
            } else {
                if (multiselect) {
                    activeEnemyPlayersBuffer.push(newActiveEnemyPlayer);
                } else {
                    activeEnemyPlayersBuffer = [newActiveEnemyPlayer];
                }
            }

            setActiveEnemyPlayers(activeEnemyPlayersBuffer)
        }

    }

    return (
        <div className="match-context-container">
            <div className="match-context-top-container">
            <div className="graph-config-container">
                    <div className="graph-config-sub-container">
                        <h3 className="graph-config-title">Metric</h3>
                        <div className="graph-config-content-container">
                            <div className="graph-config-grid">
                                <div className="graph-config-content-container">
                                    <div 
                                        onClick={() => handleMetricClick(Metric.GOLD)}
                                        className={`graph-config-item ${(activeMetrics.includes(Metric.GOLD)) ? 'active' : ''}`}
                                    >
                                        Gold
                                    </div>
                                    <div 
                                        onClick={() => handleMetricClick(Metric.XP)}
                                        className={`graph-config-item ${(activeMetrics.includes(Metric.XP)) ? 'active' : ''}`}
                                    >
                                        XP
                                    </div>
                                </div>
                                <div className="graph-config-content-container">
                                    <div 
                                        onClick={() => handleMetricClick(Metric.CS)}
                                        className={`graph-config-item ${(activeMetrics.includes(Metric.CS)) ? 'active' : ''}`}
                                    >
                                        CS
                                    </div>
                                    <div 
                                        onClick={() => handleMetricClick(Metric.LEVEL)}
                                        className={`graph-config-item ${(activeMetrics.includes(Metric.LEVEL)) ? 'active' : ''}`}
                                    >
                                        Level
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="graph-config-sub-container">
                        <h3 className="graph-config-title">Mode</h3>
                        <div className="graph-config-content-container">
                            <div 
                                onClick={() => handleModeClick(Mode.ADVANTAGE)}
                                className={`graph-config-item ${(activeMode === Mode.ADVANTAGE) ? 'active' : ''}`}
                            >
                                Advantage
                            </div>
                            <div 
                                onClick={() => handleModeClick(Mode.GROWTH)}
                                className={`graph-config-item ${(activeMode === Mode.GROWTH) ? 'active' : ''}`}
                            >
                                Growth
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="match-context-bottom-container">
                <div className="match-context-sub-top-container">
                        { displayRoleList && displayRoleList.length > 0 && displayRoleList.map((display: DisplayRole) => (
                            <div onClick={() => handleRoleClick(display)} className={`graph-role-item ${(activeRoles.includes(display.role)) ? 'active' : ''}`}> 
                                <div className="graph-role-image-container">
                                    <ChampionImage champion={display.allyChampion} /> 
                                </div>
                                <div className="graph-role-title">{display.role}</div>
                                <div className="graph-role-image-container">
                                    <ChampionImage champion={display.enemyChampion} />
                                </div>
                            </div>  
                        ))}
                        <div onClick={() => handleTeamClick()} className={`graph-role-item all ${(teamToggle) ? 'active': ''}`}>Team</div>
                    </div>
                </div>
            </div>
    )
}

export default MatchContext
