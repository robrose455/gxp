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
import { Data, Dataset, Event, MatchData, MetricData } from '../../types';
import './TimelineGraph.css';
import { getSecondsOffsetFromTimestamp, toTitleCase } from '../../timestamp-util';

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
    activeDatasets: Dataset[];
    activeMetrics: Metric[];
    activeMode: Mode;
    activeMarkers: string[];
    matchData: MatchData;
    events: Event[]
}

const TimelineGraph: React.FC<TimelineGraphProps> = ({ 
    activeDatasets, 
    activeMetrics,
    activeMode,
    activeMarkers,
    events, 
    matchData,
}) => {

    const [displayMode, setDisplayMode] = useState<string>("");

    const [graphDatasets, setGraphDatasets] = useState<any[]>([]);
    const [graphYMin, setGraphYMin] = useState<number>(0);
    const [graphYMax, setGraphYMax] = useState<number>(1000);

    // Loading State
    const [dataLoaded, setDataLoaded] = useState(false);

    // Graph Scope Data
    const [frameLabels, setFrameLabels] = useState<any>([]);
    const [minFrame, setMinFrame] = useState<any>(0);
    const [maxFrame, setMaxFrame] = useState<any>(0);
    const [numOfFrames, setNumOfFrames] = useState<any>(0);

    // Computed data ready for graph display
    const [computedBaronPowerPlays, setComputedBaronPowerPlays] = useState<any>([])
    const [computedDeath, setComputedDeath] = useState<any>([]);
    const [computedKills, setComputedKills] = useState<any>([]);

    // New Data Coming In -> Setup New Frames
    useEffect(() => {

        if (activeDatasets?.length > 0) {

            const sampleDataset = activeDatasets[0];
            setMinFrame(0);
            setMaxFrame(sampleDataset.data.length - 2);
            setNumOfFrames(sampleDataset.data.length - 2);

            const graphLabels = [];
            for (let i = 0; i <= sampleDataset.data.length - 2; i++) {
                graphLabels.push(i.toString());
            }

            setFrameLabels(graphLabels);
        }

    }, [activeDatasets, events])

    useEffect(() => {

        switch (activeMode) {
            case Mode.GROWTH:
                setDisplayMode('Growth Rate');
                break;
            case Mode.ADVANTAGE:
                setDisplayMode('Advantage Percentage');
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
    /* useEffect(() => {
        
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

    }, [activeDatasets, activeMarkers]) */
    

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

    
    /* const buildComputedKillAnnotations = () => {

        let index = 0;

        let killAnnotationsObject: any = {};

        for (const event of events) {

            if (event.type === 'kill' && ((activeDatasets.some((dataset) => dataset.id === event.killer)) || (activeAllyDatasets.some((dataset) => dataset.id === event.killer)))) {

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
    } */

        useEffect(() => {

            let graphInputs = [];

            for (const dataset of activeDatasets) {
                const graphInput = {
                    label: `${dataset.metric} ${dataset.mode}`,
                    data: dataset.data,
                    borderColor: dataset.display.theme['borderColor'],
                    backgroundColor: dataset.display.theme['backgroundColor'],
                    fill: true,
                    borderWidth: 2
                }

                graphInputs.push(graphInput)
            }

            setGraphDatasets(graphInputs)
            console.log(graphInputs);
            setDataLoaded(true)

        }, [activeDatasets])

        useEffect(() => {

            const rawDatasets = activeDatasets.map((dataset) => {
                return dataset.data;
            })

            const flatData = rawDatasets.flat()

            const max = Math.max(...flatData) + 10;
            const min = Math.min(...flatData) + 10;

            setGraphYMax(max);
            setGraphYMin(min);

        }, [activeDatasets])

        

    
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            annotation: {
                annotations: { ...computedBaronPowerPlays, ...computedDeath, ...computedKills}
            },
            title: {
                display: true,
                text: `${displayMode}`,
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

                        const metricLabels = activeDatasets.map((dataset) => {
                            return {
                                text: `${dataset.display.title}`,
                                fontColor: '#E0E0E0',
                                fillStyle: dataset.display.theme['backgroundColor'],
                                strokeStyle: dataset.display.theme['borderColor'],
                                lineWidth: 2 
                            }
                        })

                        const markerLabels = activeMarkers.map((marker: string) => {

                            if (marker === 'Death') {
                                return {
                                    text: "Time Dead",
                                    fontColor: '#E0E0E0',
                                    fillStyle: 'rgba(128, 128, 128, 1)',
                                    strokeStyle: 'rgba(128, 128, 128, 0.5)',
                                    lineWidth: 2,
                                }
                            }

                            if (marker === 'Baron') {
                                return {
                                    text: "Baron Buff",
                                    fontColor: '#E0E0E0',
                                    fillStyle: 'rgba(186, 85, 211, 1)',
                                    strokeStyle: 'rgba(186, 85, 211, 0.2)',
                                    lineWidth: 2
                                }
                            }

                            if (marker === 'Kill') {
                                return {
                                    text: `Ally Kill`,
                                    fontColor: '#E0E0E0',
                                    fillStyle: 'rgba(76, 175, 235, 1)',
                                    lineWidth: 2 
                                }
                            }

                            return {
                                text: 'Marker',
                                fontColor: 'white',
                                fillStyle: 'white',
                                lineWidth: 2
                            }
                        })
                        const labels = [
                            ...metricLabels,
                            ...markerLabels
                        ]

                        return labels
                    }, 
                },
            },
            tooltip: {
                backgroundColor: '#2E2E2E', 
                titleColor: '#E0E0E0', 
                bodyColor: '#E0E0E0', 
                mode: 'index' as const,
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        let sign = ""
                        if (value > 0) {
                            sign = "+"
                        }
                        return ` ${toTitleCase(context.dataset.label)}: ${sign}${value.toFixed(0)}%`
                    },
                    title: function(context: any) {
                        return `${context[0].label} Minutes`
                    }
                }
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
                suggestedMin: graphYMin,
                suggestedMax: graphYMax
            },
        },
    }

    const data = {
        labels: frameLabels,
        datasets: graphDatasets
    }

    return (
        <div className="dashboard-graph-sub-container">
            { dataLoaded && 
                <div className="line-graph">
                   <Line data={data} options={options} /> 
                </div>
            }
        </div>
    )
}

export default TimelineGraph
