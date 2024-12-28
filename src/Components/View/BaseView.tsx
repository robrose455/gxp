import React, { useState, useEffect } from 'react'
import './View.css'
import { TrendContext } from '../../types'

interface BaseViewProps {
    id: string,
    context: TrendContext, 
    children: (viewData: any) => React.ReactNode 
}


const BaseView: React.FC<BaseViewProps> = ({ id, context, children }) => {

    const [viewData, setViewData] = useState<any>()

    // Populate View Data
    useEffect(() => {

        if (id && context && context.data && context.resource) {

            const currentRole = context.role;
            const data = context.data;
            const roleData = data[currentRole];
            const statGroups = roleData['stats'];
            const numOfMatches = roleData['totalMatches']
            const activeStatGroup = statGroups.find((sg: any) => sg.id === id);
           
            setViewData({
                totalMatches: numOfMatches,
                stats: activeStatGroup
            });

        }

    }, [id, context])
    

    return (
        <div className="base-view-container">{viewData && children(viewData)}</div>
    )

}

export default BaseView