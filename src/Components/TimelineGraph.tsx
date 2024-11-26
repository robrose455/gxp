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
    activeAllyDataset: any;
    activeEnemyDataset: any;
    activeMetric: any;
    events: any
}

const TimelineGraph: React.FC<TimelineGraphProps> = ({ activeAllyDataset, activeEnemyDataset, activeMetric, events }) => {

    const [dataLoaded, setDataLoaded] = useState(false);
    const [frameLabels, setFrameLabels] = useState<any>([]);
    const [minFrame, setMinFrame] = useState<any>(0);
    const [maxFrame, setMaxFrame] = useState<any>(0);
    const [numOfFrames, setNumOfFrames] = useState<any>(0);

    const [computedAllyDataset, setComputedAllyDataset] = useState<any>([]);
    const [computedBaronPowerPlays, setComputedBaronPowerPlays] = useState<any>([])

    const buildComputedBaronAnnotations = () => {

        let index = 0;

        let baronAnnotationsObject: any = {};

        for (const event of events) {

            if (event['subtype'] === 'BARON_NASHOR') {
                const annotation = {
                    type: 'box' as const,
                    backgroundColor: 'rgba(186, 85, 211, 0.2)',
                    borderColor: 'rgba(186, 85, 211, 0.8)',
                    borderWidth: 2,
                    xMax: event['frame'] - 3,
                    xMin: event['frame'],
                    yMax: 10000,
                    yMin: -10000,
                }


                baronAnnotationsObject[`baron${index}`] = annotation;
            }
        }

        return baronAnnotationsObject;
    }


    useEffect(() => {
        setComputedBaronPowerPlays(buildComputedBaronAnnotations());
    }, [events, minFrame, maxFrame])

    useEffect(() => {

        if (activeAllyDataset?.length > 0 && activeEnemyDataset?.length > 0) {

            const computedAllyData: any[] = [];
            const computedEnemyData: any[] = [];

            for (let i = 0; i <= activeAllyDataset.length - 1; i++) {

                const computedAllyDataPoint = activeAllyDataset[i] - activeEnemyDataset[i];
                const computedEnemyDataPoint = activeEnemyDataset[i] - activeAllyDataset[i];
                
                computedAllyData.push(computedAllyDataPoint);
                computedEnemyData.push(computedEnemyDataPoint);

            }

            setComputedAllyDataset(computedAllyData);
            
            setDataLoaded(true);

            const frames = [];
            for (let i = 0; i <= activeAllyDataset.length - 1; i++) {
                frames.push(i.toString());
            }

            setMinFrame(0);
            setMaxFrame(activeAllyDataset.length - 1);
            setNumOfFrames(activeAllyDataset.length - 1);
            setFrameLabels(frames);
        }

    }, [activeAllyDataset, activeEnemyDataset, events])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            annotation: {
                annotations: computedBaronPowerPlays
            },
            legend: {
                labels: {
                    color: '#E0E0E0', 
                },
            },
            tooltip: {
                callbacks: {
                    afterLabel: (context: any) => {
                        const frame = parseInt(context.label.split(' ')[0], 10);
                        const event = events.find((e: any) => e['pos'] === (frame - minFrame));
                        return event ? `${event['label']}` : "";
                    }
                },
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
                suggestedMin: Math.min(...computedAllyDataset),
                suggestedMax: Math.max(...computedAllyDataset)
            },
        },
    }

    const data = {
        labels: frameLabels,
        datasets: [
            {
                label: `${activeMetric} Difference`, // TODO Add Champion Name To Dataset Context
                data: computedAllyDataset,
                borderColor: '#DAA520',
                backgroundColor: 'rgba(218, 165, 32, 0.2)',
                fill: true,
                borderWidth: 2,
            }
        ]
    }

    useEffect(() => {

        const frames = [];

        for (let i = minFrame; i <= maxFrame; i++) {
            frames.push(i.toString());
        }

        setFrameLabels(frames);

        // Recompute Data off of new min & max
        const computedAllyData: any[] = [];
        const computedEnemyData: any[] = [];

        for (let i = minFrame; i <= maxFrame; i++) {

            const computedAllyDataPoint = activeAllyDataset[i] - activeEnemyDataset[i];
            const computedEnemyDataPoint = activeEnemyDataset[i] - activeAllyDataset[i];
            
            computedAllyData.push(computedAllyDataPoint);
            computedEnemyData.push(computedEnemyDataPoint);

        }

        setComputedAllyDataset(computedAllyData);


    }, [minFrame, maxFrame])

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

    return (
        <div className="line-graph">
            { dataLoaded && <Line data={data} options={options} /> }
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
    )
}

export default TimelineGraph
