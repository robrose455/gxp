import React from 'react'
import BaseView from './BaseView'
import ResourceAdvantageOverTimeChart from '../Charts/ResourceAdvantageOverTimeChart'
import '../Charts/Charts.css'
import { TrendContext } from '../../types'

interface TotalViewProps {
  id: string,
  context: TrendContext,
}

const TotalView: React.FC<TotalViewProps> = ({ id, context }) => {

    const config = {
        rounding: 0,
        percentage: false,
        title: 'Total'
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

export default TotalView