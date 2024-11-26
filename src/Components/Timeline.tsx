import { useState, useEffect } from 'react';
import './Timeline.css';

interface TimelineProps {
    matchData: any;
    events: any;
}

const Timeline: React.FC<TimelineProps> = ({ matchData, events }) => {

    const [timelineData, setTimelineData] = useState<any>([]);

    useEffect(() => {

        const timelineDisplayData = [];

        if (matchData && events.length > 0) {

            for (const event of events) {

                let timelineDisplayEvent: any = {};

                // Map type to display type 
                if (event['type'] === 'kill') {

                    timelineDisplayEvent['type'] = 'Kill';

                    // Get the Killer Champion
                    const killerId = event['killer'];

                    const killer = matchData['participants'].find((player: any) => player.id === killerId);

                    const killerChampion = killer['champion'];

                    // Get the Victim Champion

                    const victimId = event['subtype'];

                    const victim = matchData['participants'].find((player: any) => player.id === victimId);

                    const victimChampion = victim['champion'];

                    timelineDisplayEvent['body'] = `${killerChampion} killed ${victimChampion}`;


                }

                if (event['type'] === 'objective') {

                    timelineDisplayEvent['type'] = 'Objective Taken'

                    let objType = '';

                    if (event['subtype'] === 'HORDE') {
                        objType = 'Grub';
                    }

                    if (event['subtype'] === 'DRAGON') {
                        objType = 'Dragon'
                    }

                    if (event['subtype'] === 'RIFTHERALD') {
                        objType = 'Rift Herald'
                    }

                    if (event['subtype'] === 'BARON_NASHOR') {
                        objType = 'Baron'
                    }


                    timelineDisplayEvent['body'] = `${objType} slain`

                }

                if (event['type'] === 'turret') {
                    timelineDisplayEvent['type'] = 'Turret Destroyed'

                    const killerId = event['killer'];

                    const killer = matchData['participants'].find((player: any) => player.id === killerId);

                    const killerChampion = killer['champion'];

                    let turretType = '';
                    if (event['subtype'] === 'OUTER_TURRET') {
                        turretType = 'Outer Turret'
                    } else if (event['subtype'] === 'INNER_TURRET') {
                        turretType = 'Inner Turret'
                    } else if (event['subtype'] === 'INHIBITOR') {
                        turretType = 'Inhibitor'
                    } else if (event['subtype'] === 'BASE_TURRET') {
                        turretType = 'Base Turret'
                    } else if (event['subtype'] === 'NEXUS_TURRET') {
                        turretType = 'Nexus Target'
                    }

                    timelineDisplayEvent['body'] = `${turretType} destroyed`
                }

                // Format Timestamp
                timelineDisplayEvent['time'] = formatTimestampToTime(event['timestamp']);
                timelineDisplayEvent['team'] = event['team'];

                timelineDisplayData.push(timelineDisplayEvent);
            }

            setTimelineData(timelineDisplayData);
        }

    }, [matchData])

    const formatTimestampToTime = (timestamp: number) => {

        // Convert milliseconds to total seconds
        const totalSeconds = Math.floor(timestamp / 1000);

        // Calculate minutes and seconds
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Return the formatted time string in mm:ss format
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;

    }

    return (
        <div className="timeline-event-list-container">
            { timelineData?.length > 0 && timelineData.map((event: any) => (
                <div className={`timeline-event-container ${(event['team'] === 'ally') ? 'ally' : 'enemy' }`}>
                    <div className="timeline-event-body">
                        {event['body']}
                    </div>
                    <div className="timeline-event-time">
                        {event['time']}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Timeline
