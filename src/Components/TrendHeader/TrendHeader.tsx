import React, { Dispatch, SetStateAction } from 'react'
import './TrendHeader.css'
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

interface TrendHeaderProps {
    activeRole: string;
    setActiveRole: Dispatch<SetStateAction<string>>;
    activeResource: string;
    setActiveResource: Dispatch<SetStateAction<string>>;
    activeStat: string;
    setActiveStat: Dispatch<SetStateAction<string>>;
}

const TrendHeader: React.FC<TrendHeaderProps> = ({ 
    activeRole, 
    setActiveRole,
    activeResource,
    setActiveResource,
    activeStat,
    setActiveStat 
}) => {
  return (
    <div className="header-main-container">
       {/* Role Dropdown */}
      <FormControl sx={{ minWidth: 150, marginRight: 2 }}>
        <Typography variant="h6" style={{ marginBottom: '8px', color: '#e0e0e0' }}>
            Role
        </Typography>
        <Select
          value={activeRole}
          onChange={(e) => setActiveRole(e.target.value)}
          sx={{backgroundColor: '#2A2A2A', color: '#e0e0e0', border: '1px solid goldenrod'}}
        >
          <MenuItem value="top">Top</MenuItem>
          <MenuItem value="jungle">Jungle</MenuItem>
          <MenuItem value="mid">Mid</MenuItem>
          <MenuItem value="adc">ADC</MenuItem>
          <MenuItem value="support">Support</MenuItem>
        </Select>
      </FormControl>

      {/* Resource Dropdown */}
      <FormControl sx={{ minWidth: 150, marginRight: 2 }}>
      <Typography variant="h6" style={{ marginBottom: '8px', color: '#e0e0e0' }}>
            Resource
        </Typography>
        <Select
          value={activeResource}
          onChange={(e) => setActiveResource(e.target.value)}
          sx={{backgroundColor: '#2A2A2A', color: '#e0e0e0', border: '1px solid goldenrod'}}
        >
          <MenuItem value="GOLD">Gold</MenuItem>
          <MenuItem value="CS">CS</MenuItem>
          <MenuItem value="XP">XP</MenuItem>
        </Select>
      </FormControl>

      {/* Stat Dropdown */}
      <FormControl sx={{ minWidth: 150 }}>
        <Typography variant="h6" style={{ marginBottom: '8px', color: '#e0e0e0' }}>
            Stat
        </Typography>
        <Select
          value={activeStat}
          onChange={(e) => setActiveStat(e.target.value)}
          sx={{backgroundColor: '#2A2A2A', color: '#e0e0e0', border: '1px solid goldenrod'}}
        >
          <MenuItem value="GROWTH_RATE">Growth Rate</MenuItem>
          <MenuItem value="PER_MINUTE">Resource Per Minute</MenuItem>
          <MenuItem value="TOTAL">Total</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

export default TrendHeader