import React from 'react'
import './SideNav.css'
import { useNavigate } from 'react-router-dom'
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LayersIcon from '@mui/icons-material/Layers';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SideNav = () => {

    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate(`/`);
    }

    const handleAccountClick = () => {
        navigate('/');
    }

    const handleMatchesClick = () => {
        navigate('/');
    }

    const handleTrendsClick = () => {
        navigate('/');
    }

    const handleBreakdownClick = () => {
        navigate('/');
    }

  return (
    <div className="side-nav-main-container">
        <div className="logo-container">
            <div onClick={handleLogoClick} className="logo">
                <span className="gold">G</span>XP
            </div>
        </div>
        <div className="nav-link-container">
            <div onClick={handleAccountClick} className="nav-link-item">
                <AccountCircleIcon />
                Account
            </div>
            <div onClick={handleAccountClick} className="nav-link-item">
                <BarChartIcon />
                Matches
            </div>
            <div onClick={handleAccountClick} className="nav-link-item">
                <TrendingUpIcon />
                Trends
            </div>
            <div onClick={handleAccountClick} className="nav-link-item">
                <LayersIcon />
                Breakdown
            </div>
        </div>
        <div className="side-nav-footer">
         2024 GXP ™
        </div>
    </div>
  )
}

export default SideNav