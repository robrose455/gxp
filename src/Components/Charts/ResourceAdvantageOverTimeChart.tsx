import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { TrendContext } from '../../types';
import { toTitleCase } from '../../timestamp-util';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    ChartDataLabels
);

interface ResourceAdvantageOverTimeChartProps {
    data: any;
    context: TrendContext;
    config: any;
}

const ResourceAdvantageOverTimeChart:React.FC<ResourceAdvantageOverTimeChartProps>  = ({ data, context, config }) => {

    const formatStat = (stat: any) => {
        const statReturn = stat.value
        console.log(statReturn);
        return statReturn
    }

    const positiveTheme = {
        background: 'rgba(76, 175, 80, 0.8)',
        border: '#4CAF50'
    }
    const negativeTheme = {
        background: 'rgba(244, 67, 54, 0.8)',
        border: '#F44336'
    }

    const [cdata, setCData] = useState<any>({
        player: [],
        enemy: [],
        advantage: []
    })

    const [yMin, setYMin] = useState<number>(-100);
    const [yMax, setYMax] = useState<number>(100);

    const [title, setTitle] = useState<string>("Default Title");
    const [rounding, setRounding] = useState<number>(0);
    const [usePercent, setUsePercent] = useState<boolean>(false);

    useEffect(() => {

        if (config['rounding'] !== undefined) {
            setRounding(config['rounding'])
        }

        if (config['title']) {
            setTitle(`Average ${toTitleCase(context['resource'])} ${config['title']}`)
        }

        if (config['percentage'] !== undefined) {
            setUsePercent(config['percentage'])
        }

    }, [config])

    const chartData = {
        labels: ['Overall', 'Early (0-14)', 'Mid (14-28)', 'Late (28+)'],
        datasets: [
            {
                label: 'You',
                data: cdata['player'],
                backgroundColor: positiveTheme.background,
                borderColor: positiveTheme.border,
                borderWidth: 1,
            },
            {
                label: 'Enemy',
                data: cdata['enemy'],
                backgroundColor: negativeTheme.background,
                borderColor: negativeTheme.border,
                borderWidth: 1,
            }
        ],
    }

    const options = {
        responsive: true,
        layout: {
            padding: {
              top: 20,    // Padding at the top
              right: 60,  // Padding on the right
              bottom: 20, // Padding at the bottom
              left: 20,   // Padding on the left
            },
          },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: title,
                color: '#E0E0E0',
                padding: 20,
                font: {
                    size: 16
                }
            },
            datalabels: {
                display: true, // Enable datalabels
                color: 'white', // Set label color
                anchor: 'end' as const,
                align: 'start' as const,
                offset: -20,
                formatter: (value: any) => {
                    const roundedValue = value.toFixed(rounding); 

                    if (usePercent === true) {
                        return `${roundedValue}%`;
                    } else {
                        return `${roundedValue}`
                    }
                },
            }, 
        },
        scales: {
          x: {
            stacked: false,
          },
          y: {
            min: yMin,
            max: yMax,
          },
        },
    };

    useEffect(() => {

        if (data && data.stats) {

            const stats = data.stats;

            setCData({
                player: [
                    formatStat(stats[0]),
                    formatStat(stats[1]),
                    formatStat(stats[2]),
                    formatStat(stats[3]),
                ],
                enemy: [
                    formatStat(stats[4]),
                    formatStat(stats[5]),
                    formatStat(stats[6]),
                    formatStat(stats[7]),
                ],
                advantage: [
                    formatStat(stats[8]),
                    formatStat(stats[9]),
                    formatStat(stats[10]),
                    formatStat(stats[11]),
                ]
            }) 
        }
    }, [data])

    useEffect(() => {

        console.log(context);
        
        if (cdata) {

            // Get Base Boundary
            let boundary = 0;

            if (context['resource'] === 'GOLD') {
                boundary = 50;
            }

            if (context['resource'] === 'XP') {
                boundary = 25;
            }

            if (context['resource'] === 'CS') {
                boundary = 3;
            }

            setYMin(0)
            setYMax(Math.max(...cdata['player'], ...cdata['enemy']) * 1.5);
        }

    }, [cdata])
    

    return (
        <Bar data={chartData} options={options} />
    )

}

export default ResourceAdvantageOverTimeChart