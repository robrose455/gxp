import { TextField, Button } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';

import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { Metric, Mode } from '../../constants';
import { calculateDeathTimer } from '../../death-timer-util';
import { getSecondsOffsetFromTimestamp } from '../../timestamp-util';
import { Data, Event, MatchData, MetricData } from '../../types';
import './TimelineGraph.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  zoomPlugin
);

interface TimelineGraphProps {
    activeAllyDatasets: MetricData[];
    activeEnemyDatasets: MetricData[];
    activeMetric: Metric;
    activeMode: Mode;
    activeMarkers: string[];
    activeRoles: string[];
    matchData: MatchData;
    matchDataLoading: boolean;
    events: Event[]
}

const TimelineGraph: React.FC<TimelineGraphProps> = ({ 
    activeAllyDatasets, 
    activeEnemyDatasets, 
    activeMetric,
    activeMode,
    activeRoles,
    activeMarkers,
    events, 
    matchData,
    matchDataLoading
}) => {

    const [activeMetricTheme, setActiveMetricTheme] = useState<any>({
        borderColor: '#DAA520',
        backgroundColor: 'rgba(218, 165, 32, 0.2)', 
    });

    const [displayMetric, setDisplayMetric] = useState<string>("");
    const [displayMode, setDisplayMode] = useState<string>("");

    // Loading State
    const [dataLoaded, setDataLoaded] = useState(false);

    // Graph Scope Data
    const [frameLabels, setFrameLabels] = useState<any>([]);
    const [minFrame, setMinFrame] = useState<any>(0);
    const [maxFrame, setMaxFrame] = useState<any>(0);
    const [numOfFrames, setNumOfFrames] = useState<any>(0);

    // Computed data ready for graph display
    const [computedMetricDataset, setComputedMetricDataset] = useState<any>([]);
    const [computedBaronPowerPlays, setComputedBaronPowerPlays] = useState<any>([])
    const [computedDeath, setComputedDeath] = useState<any>([]);
    const [computedKills, setComputedKills] = useState<any>([]);

    // New Data Coming In -> Setup New Frames
    useEffect(() => {

        if (activeAllyDatasets?.length > 0 && activeEnemyDatasets?.length > 0) {

            const sampleDataset = activeAllyDatasets[0];
            setMinFrame(0);
            setMaxFrame(sampleDataset.data.length - 2);
            setNumOfFrames(sampleDataset.data.length - 2);

            const graphLabels = [];
            for (let i = 0; i <= sampleDataset.data.length - 2; i++) {
                graphLabels.push(i.toString());
            }

            setFrameLabels(graphLabels);
        }

    }, [activeAllyDatasets, events])

    useEffect(() => {

        switch (activeMetric) {
            case Metric.XP:
                setDisplayMetric('XP');
                setActiveMetricTheme({
                    borderColor: '#FF007F',
                    backgroundColor: 'rgba(255, 102, 178, 0.2)',
                })
                break;
            case Metric.GOLD:
                setDisplayMetric('Gold');
                setActiveMetricTheme({
                    borderColor: '#DAA520',
                    backgroundColor: 'rgba(218, 165, 32, 0.2)',
                })
                break;
            case Metric.CS:
                setDisplayMetric('CS')
                setActiveMetricTheme({
                    borderColor: '#D50032',
                    backgroundColor: 'rgba(255, 65, 54, 0.2)'
                })
                break;
        }
    }, [activeMetric])

    useEffect(() => {

        switch (activeMode) {
            case Mode.GROWTH:
                setDisplayMode('Growth Rate');
                break;
            case Mode.ADVANTAGE:
                setDisplayMode('Advantage');
                break;   
        }

    }, [activeMode])

    // On Manual Frame Change - Modify Labels
    useEffect(() => {
        
        if (maxFrame > 0) {

            const graphLabels = [];
            for (let i = minFrame; i <= maxFrame; i++) {
                graphLabels.push(i.toString());
            }

            setFrameLabels(graphLabels);
        }

    }, [minFrame, maxFrame])

    // On Frame Change - Recalcuate Annotation Event Data Set
    useEffect(() => {
        
        if (activeMarkers.includes('Death')) {
            buildComputedDeathAnnotations();
        } else {
            setComputedDeath(null);
        }

        if (activeMarkers.includes('Baron')) {
            buildComputedBaronAnnotations();
        } else {
            setComputedBaronPowerPlays(null);
        }

        if (activeMarkers.includes('Kill')) {
            buildComputedKillAnnotations();
        } else {
            setComputedKills(null);
        }

    }, [activeAllyDatasets, minFrame, maxFrame, activeMarkers]) 

    // On Frame Change - Recalculate Metric Data Set
    useEffect(() => {

        if (activeAllyDatasets?.length > 0 && activeEnemyDatasets?.length > 0 && maxFrame > 0 && numOfFrames > 0) {

            const computedMetricData: any[] = [];

            let aggregatedAllyDataset: number[] = [];
            
            for (let i = 0; i < activeEnemyDatasets[0].data.length; i++) {
                let aggregatedDatapoint = 0;
                for (const allyDataset of activeAllyDatasets) {
                    const datapoint = allyDataset.data[i];
                    aggregatedDatapoint = aggregatedDatapoint + datapoint;
                }
                aggregatedAllyDataset.push(aggregatedDatapoint);
            }

             let aggregatedEnemyDataset: number[] = [];
            
            for (let i = 0; i < activeEnemyDatasets[0].data.length; i++) {
                let aggregatedDatapoint = 0;
                for (const enemyDataset of activeEnemyDatasets) {
                    const datapoint = enemyDataset.data[i];
                    aggregatedDatapoint = aggregatedDatapoint + datapoint;
                }
                aggregatedEnemyDataset.push(aggregatedDatapoint);
            }

            for (let i = minFrame; i <= maxFrame; i++) {

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
                    computedMetricDataPoint = aggregatedAllyDataset[i] - aggregatedEnemyDataset[i];
                }

                computedMetricData.push(computedMetricDataPoint);

            }

            console.log('Finish: ', computedMetricData);

            setComputedMetricDataset(computedMetricData);
            setDataLoaded(true);

        }

    }, [activeAllyDatasets, activeEnemyDatasets, minFrame, maxFrame, activeMetric, activeMode])

    const handleMinFrameChange = (event: any) => {

        if (event) {
            const inputValue = event.target.value;
            setMinFrame(inputValue);
        }
    }

    const handleMaxFrameChange = (event: any) => {

        if (event) {
            const inputValue = event.target.value;
            setMaxFrame(inputValue);
        }
    }

    const handleReset = () => {
        setMinFrame(0);
        setMaxFrame(numOfFrames);
    }
    
    const buildComputedKillAnnotations = () => {

        let index = 0;

        let killAnnotationsObject: any = {};

        for (const event of events) {

            if (event.type === 'kill' && ((activeEnemyDatasets.some((dataset) => dataset.id === event.killer)) || (activeAllyDatasets.some((dataset) => dataset.id === event.killer)))) {

                const teamBorderColor = (event.team === 'ally') ? '#4CAFEB' : '#FF4C4C'

                const secondsOffset = getSecondsOffsetFromTimestamp(event['timestamp']) / 60 ;
                const killTime = event['frame'] - (minFrame) - 1 + secondsOffset;

                index++;

                const annotation = {
                    type: 'point' as const,
                    borderWidth: 3,
                    pointStyle: 'crossRot' as const,
                    borderColor: teamBorderColor,
                    xMin: killTime,
                    xMax: killTime, 
                    yMin: 0,
                    yMax: 0
                }

                killAnnotationsObject[`allyKill${index}`] = annotation;

            }
        }

        setComputedKills(killAnnotationsObject);
    } 

    const buildComputedDeathAnnotations = () => {

        let index = 0;

        let deathAnnotationsObject: any = {};

        for (const event of events) {

            if (event.type === 'kill' && ((activeEnemyDatasets.some((dataset) => dataset.id === event.killer)) || (activeAllyDatasets.some((dataset) => dataset.id === event.killer)))) {

                index++;

                const teamBorderColor = (event.team === 'ally') ? '#FF4C4C' : '#4CAFEB'

                const secondsOffset = getSecondsOffsetFromTimestamp(event['timestamp']) / 60 ;
                const participantData = matchData.data;
                const minute = event['frame'] - 1;

                let level = 0;
                const victimData = participantData.find((p: Data) => p.id === event['subtype']);

                if (victimData) {
                    level = victimData.level[minute];
                }
                
                const deathTimer = calculateDeathTimer(level, minute)
            
                const deathTimerOffset = deathTimer / 60;

                const deathStart = event['frame'] - (minFrame) - 1 + secondsOffset;
                const deathEnd = deathStart + deathTimerOffset;

                const annotation = {
                    type: 'box' as const,
                    backgroundColor: 'rgba(128, 128, 128, 0.5)', // Gray with 50% opacity
                    borderColor: teamBorderColor,
                    borderWidth: 1,
                    borderDash: [6, 6],
                    xMax: deathEnd,
                    xMin: deathStart,
                    yMax: 20000,
                    yMin: -20000,
                }

                deathAnnotationsObject[`death${index}`] = annotation;
            } 
        }

        setComputedDeath(deathAnnotationsObject);
    } 

   const buildComputedBaronAnnotations = () => {

        let index = 0;

        let baronAnnotationsObject: any = {};

        for (const event of events) {

            if (event['subtype'] === 'BARON_NASHOR') {

                index++;

                const secondsOffset = getSecondsOffsetFromTimestamp(event['timestamp']) / 60 ;
                const baronStart = event['frame'] - (minFrame) - 1 + secondsOffset;
                const baronEnd = baronStart + 3;

                const teamBorderColor = (event['team'] === 'ally' ? '#4CAFEB' : '#FF4C4C')

                const annotation = {
                    type: 'box' as const,
                    backgroundColor: 'rgba(186, 85, 211, 0.4)',
                    borderColor: teamBorderColor,
                    borderWidth: 2,
                    borderDash: [6, 6],
                    xMax: baronEnd,
                    xMin: baronStart,
                    yMax: 20000,
                    yMin: -20000,
                }


                baronAnnotationsObject[`baron${index}`] = annotation;
            }
        }

        setComputedBaronPowerPlays(baronAnnotationsObject);
    }

    
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            annotation: {
                annotations: { ...computedBaronPowerPlays, ...computedDeath, ...computedKills}
            },
            title: {
                display: true,
                text: `${displayMetric} ${displayMode}`,
                color: '#E0E0E0',
                padding: 20,
                font: {
                    size: 24
                }
            },
            legend: { 
                labels: {
                    padding: 20,
                    generateLabels: (chart: any) => {
                        const labels = [
                            {
                                text: `${displayMetric} ${displayMode}`,
                                fontColor: '#E0E0E0',
                                fillStyle: activeMetricTheme.backgroundColor,
                                strokeStyle: activeMetricTheme.borderColor,
                                lineWidth: 2 
                            },
                            {
                                text: "Time Dead",
                                fontColor: '#E0E0E0',
                                fillStyle: 'rgba(128, 128, 128, 1)',
                                strokeStyle: 'rgba(128, 128, 128, 0.5)',
                                lineWidth: 2,
                            },
                            {
                                text: "Baron Buff",
                                fontColor: '#E0E0E0',
                                fillStyle: 'rgba(186, 85, 211, 1)',
                                strokeStyle: 'rgba(186, 85, 211, 0.2)',
                                lineWidth: 2
                            },
                            {
                                text: `Ally Kill`,
                                fontColor: '#E0E0E0',
                                fillStyle: 'rgba(76, 175, 235, 1)',
                                lineWidth: 2
                            },
                            {
                                text: `Enemy Kill`,
                                fontColor: '#E0E0E0',
                                fillStyle: `rgba(255, 76, 76, 1)`,
                                lineWidth: 2
                            }
                        ]

                        return labels;
                    }, 
                },
            },
            tooltip: {
                backgroundColor: '#2E2E2E', 
                titleColor: '#E0E0E0', 
                bodyColor: '#E0E0E0', 
            },
        },
        scales: {
            x: {
                grid: {
                    color: '#444444', 
                },
                ticks: {
                    color: '#E0E0E0', 
                },
            },
            y: {
                grid: {
                    color: '#444444', 
                },
                ticks: {
                    color: '#E0E0E0', 
                },
                suggestedMin: Math.min(...computedMetricDataset),
                suggestedMax: Math.max(...computedMetricDataset)
            },
        },
    }

    const data = {
        labels: frameLabels,
        datasets: [
            {
                label: `${activeMetric} ${activeMode}`, // TODO Add Champion Name To Dataset Context
                data: computedMetricDataset,
                borderColor: activeMetricTheme.borderColor,
                backgroundColor: activeMetricTheme.backgroundColor,
                fill: true,
                borderWidth: 2,
            }
        ]
    }

    return (
        <div className="dashboard-graph-sub-container">
            { dataLoaded && 
                <div className="line-graph">
                   <Line data={data} options={options} /> 
                    <div className="minute-selection-container">
                        <TextField
                            label="From Minute:"
                            type="number"
                            value={minFrame}
                            onChange={handleMinFrameChange}
                            InputProps={{
                                inputProps: { min: 0, max: numOfFrames },
                                style: { backgroundColor: '#1E1E1E', color: '#E0E0E0', width: '100px' },
                            }}
                            InputLabelProps={{
                                style: { color: '#9E9E9E' },
                            }}
                        />
                        <TextField
                            label="To Minute:"
                            type="number"
                            value={maxFrame}
                            onChange={handleMaxFrameChange}
                            InputProps={{
                                inputProps: { min: 0, max: numOfFrames }, 
                                style: { backgroundColor: '#1E1E1E', color: '#E0E0E0', width: '100px' },
                            }}
                            InputLabelProps={{
                                style: { color: '#9E9E9E' },
                            }}
                            sx={{ marginLeft: '10px'}}
                        />
                        <Button onClick={handleReset} sx={{ color: 'goldenrod', marginTop: '10px', marginLeft: '10px'}}>
                            Reset
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
}

export default TimelineGraph
