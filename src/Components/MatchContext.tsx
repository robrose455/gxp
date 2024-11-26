import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Button } from '@mui/material'
import './MatchContext.css';

interface MatchContextProps {
    activeAlly: any;
    setActiveAlly: Dispatch<SetStateAction<any>>;
    activeEnemy: any;
    setActiveEnemy: Dispatch<SetStateAction<any>>;
    matchData: any;
    setActiveMetric: Dispatch<SetStateAction<any>>;
    activeMetric: any;
    setActiveRole: Dispatch<SetStateAction<any>>;
    activeRole: any;
}

const MatchContext: React.FC<MatchContextProps> = ({ 
    matchData, 
    setActiveMetric, 
    activeAlly, 
    setActiveAlly, 
    activeEnemy, 
    setActiveEnemy, 
    activeMetric,
    setActiveRole,
    activeRole 
}) => {

    const [displayRoleList, setDisplayRoleList] = useState<any>([]);

    useEffect(() => {

        if (activeRole && matchData) {        

            const allyRoleId = matchData['participants'].find((ally: any) => ally['role'] === activeRole && ally['team'] === 'ally').id;
            const enemyRoleId = matchData['participants'].find((enemy: any) => enemy['role'] === activeRole && enemy['team'] === 'enemy').id;

            setActiveAlly(allyRoleId);
            setActiveEnemy(enemyRoleId);

        }
        
    }, [activeRole])

    useEffect(() => {

        if (matchData && matchData['participants'].length > 0) {

            const participantData = matchData['participants'];

            const displayRoleList: any[] = [];

            for (const role of ROLES) {

                let displayRole: any = {
                    role
                };

                for (const player of participantData) {

                    if (player['role'] === role) {

                        if (player['team'] === 'ally') {
                            displayRole['allyChampion'] = player['champion'];
                        }

                        if (player['team'] === 'enemy') {
                            displayRole['enemyChampion'] = player['champion'];
                        }
                    }
                }

                displayRoleList.push(displayRole);
            }
            
            setDisplayRoleList(displayRoleList);
        }

    }, [matchData])

    const handleMetricClick = (type: any) => {

        if (type === 'XP') {
            setActiveMetric('XP');
        }

        if (type === 'GOLD') {
            setActiveMetric('GOLD');
        }

    }

    const ROLES = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];

    const handleRoleClick = (role: any) => {

        if (role) {
            setActiveRole(role);
        }

    }

    return (
        <div className="match-context-container">
            <div className="champion-toggle-container">
                { displayRoleList && displayRoleList.length > 0 && displayRoleList.map((display: any) => (
                    <div onClick={() => handleRoleClick(display['role'])} className='champion-team-container'>     
                        <div className={`champion-list-item ally ${(activeAlly === matchData['participants']) ? 'active' : ''}`}><span>{display['allyChampion']}</span></div>
                        <div className={`champion-list-item ${(activeRole === display['role']) ? 'active' : ''}`}>{display['role']}</div>
                        <div className={`champion-list-item enemy`}><span>{display['enemyChampion']}</span></div>
                    </div>  
                ))}
            </div>
            <div className="graph-metric-toggle-container">
                <div 
                    onClick={() => handleMetricClick('GOLD')}
                    className={`graph-metric-item ${(activeMetric === 'GOLD') ? 'active' : ''}`}
                >
                    Gold
                </div>
                <div 
                    onClick={() => handleMetricClick('XP')}
                    className={`graph-metric-item ${(activeMetric === 'XP') ? 'active' : ''}`}
                >
                    XP
                </div>
            </div>
        </div>
    )
}

export default MatchContext
