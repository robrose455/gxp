import React, { useEffect, useState } from 'react'
import SideNav from '../Components/SideNav/SideNav'
import './TrendPage.css'
import { useSearchParams } from 'react-router-dom';
import { getTrendData } from '../riot.api';
import ResourcePerMinuteView from '../Components/View/ResourcePerMinuteView';
import TrendHeader from '../Components/TrendHeader/TrendHeader';
import { TrendContext } from '../types';
import GrowthRateView from '../Components/View/GrowthRateView';
import TotalView from '../Components/View/TotalView';

const TrendPage = () => {

    const [searchParams] = useSearchParams();

    // Query Parameters
    const accountName = searchParams.get('name') || "";
    const accountTag = searchParams.get('tag') || "";
    const sampleSize = searchParams.get('sampleSize') || "";

    const [trendDataLoading, setTrendDataLoading] = useState<boolean>();
    const [trendData, setTrendData] = useState<any>();

    const [activeRole, setActiveRole] = useState<any>('mid');
    const [activeResource, setActiveResource] = useState<string>('GOLD');
    const [activeStat, setActiveStat] = useState<string>('PER_MINUTE')

    const fetchTrendData = async () => {
        
        setTrendDataLoading(true);
        const trendDataResponse = await getTrendData(accountName, accountTag, Number(sampleSize));

        if (trendDataResponse) {
            setTrendData(trendDataResponse);
            setTrendDataLoading(false);
        }

    }
    
    useEffect(() => {
        
        if (accountName && accountTag) {
            fetchTrendData();
        }

    }, [accountName, accountTag]);

    const renderView = () => {
        switch(activeStat) {
            case 'PER_MINUTE':
                return <ResourcePerMinuteView id={`${activeResource}_${activeStat}`} context={{
                    data: trendData,
                    role: activeRole,
                    resource: activeResource
                }}/>
            case 'GROWTH_RATE':
                return <GrowthRateView id={`${activeResource}_${activeStat}`} context={{
                    data: trendData,
                    role: activeRole,
                    resource: activeResource
                }}/>
            case 'TOTAL':
                return <TotalView id={`${activeResource}_${activeStat}`} context={{
                    data: trendData,
                    role: activeRole,
                    resource: activeResource
                }}/>
        }
    }

    return (
        <div className="trends-main-container">
            <SideNav />
            <div className="trends-sub-container">
                { trendDataLoading ? 

                    <div>Loading...</div> 

                    :

                    <div className="trends-dashboard-container">
                        <div className="trends-header-container">
                            <TrendHeader
                                activeRole={activeRole} 
                                setActiveRole={setActiveRole}
                                activeResource={activeResource}
                                setActiveResource={setActiveResource}
                                activeStat={activeStat}
                                setActiveStat={setActiveStat}
                            />
                        </div>
                        <div className="trends-content-container">
                            {renderView()}
                        </div> 
                    </div>
                } 
            </div>
        </div>
    )
}

export default TrendPage