import React from 'react'
import BaseView from './BaseView'
import ResourceAdvantageOverTimeChart from '../Charts/ResourceAdvantageOverTimeChart'
import '../Charts/Charts.css'
import { TrendContext } from '../../types'

interface GrowthRateViewProps {
  id: string,
  context: TrendContext,
}

const GrowthRateView: React.FC<GrowthRateViewProps> = ({ id, context }) => {

    const config = {
        rounding: 1,
        percentage: true,
        title: 'Growth Rate'
    }

    return (
        <BaseView id={id} context={context}>
        {(viewData) => (
            <div className="chart-container">
            { viewData && <ResourceAdvantageOverTimeChart data={viewData} context={context} config={config} /> }
            </div>
        )}
        </BaseView>
    )
}

export default GrowthRateView