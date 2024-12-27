import React from 'react'
import BaseView from './BaseView'
import ResourceAdvantageOverTimeChart from '../Charts/ResourceAdvantageOverTimeChart'
import '../Charts/Charts.css'
import { TrendContext } from '../../types'

interface ResourcePerMinuteViewProps {
  id: string,
  context: TrendContext,
}
const ResourcePerMinuteView: React.FC<ResourcePerMinuteViewProps
> = ({ id, context }) => {

  const config = {
    rounding: 0,
    percentage: false,
    title: 'Per Minute'
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

export default ResourcePerMinuteView