import './SideNav.css'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const SideNav = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const pathName = location.pathname;

    const [searchParams] = useSearchParams();

    // Query Parameters
    const accountName = searchParams.get('name') || "";
    const accountTag = searchParams.get('tag') || "";
    const sampleSize = searchParams.get('sampleSize') || 10;

    const handleLogoClick = () => {
        navigate(`/`);
    }

    const handleMatchesClick = () => {
        navigate(`/match-history?name=${accountName}&tag=${accountTag}`);
    }

    const handleTrendsClick = () => {
        navigate(`/trends?name=${accountName}&tag=${accountTag}&sampleSize=${sampleSize}`);
    }

  return (
    <div className="side-nav-main-container">
        <div className="logo-container">
            <div onClick={handleLogoClick} className="logo">
                <span className="gold">G</span>XP
            </div>
        </div>
        <div className="nav-link-container">
            <div onClick={handleMatchesClick} className={`nav-link-item ${pathName === 'dashboard' ? 'active' : ''}`}>
                <BarChartIcon />
                Matches
            </div>
            <div onClick={handleTrendsClick} className={`nav-link-item ${pathName === '/trends' ? 'active' : ''}`}>
                <TrendingUpIcon />
                Trends
            </div>
        </div>
        <div className="side-nav-footer">
         2024 GXP ™
        </div>
    </div>
  )
}

export default SideNav