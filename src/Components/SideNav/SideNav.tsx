import React from 'react'
import './SideNav.css'

const SideNav = () => {
  return (
    <div className="side-nav-main-container">
        <div className="logo">
            <span className="gold">G</span>XP
        </div>
        <div className="nav-link-container">
            <div className="nav-link-item">
                Account
            </div>
            <div className="nav-link-item">
                Matches
            </div>
            <div className="nav-link-item">
                Trends
            </div>
            <div className="nav-link-item">
                Breakdown
            </div>
        </div>
    </div>
  )
}

export default SideNav