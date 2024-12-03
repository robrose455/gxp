import { Card, CardContent, Grid2, Typography, Box } from '@mui/material'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { MatchPreview } from '../types';

interface MatchListProps {
    matchPreviews: MatchPreview[];
    setActiveMatch: Dispatch<SetStateAction<MatchPreview>>
}

const MatchList: React.FC<MatchListProps> = ({ matchPreviews, setActiveMatch }) => {

  const handleClick = (match: MatchPreview) => {
    setActiveMatch(match);
  }

    return (
      <div>
      <Box
        sx={{
          maxWidth: '1200px',
          height: '200px',
          overflowX: 'auto',
          margin: '0 auto',
          backgroundColor: '#121212',
          display: 'flex',
          alignItems: 'center'
        }}>
        <Box sx={{
            display: 'flex',                         
            gap: 2,                       
            padding: 2,  
            whiteSpace: 'nowrap',                
            backgroundColor: '#121212', 
            justifyContent: 'center' 
          }}
        >
      {matchPreviews.map((match, index) => (
        <Grid2 key={index}>
          <Card
            onClick={() => handleClick(match)}
            sx={{
              borderTop: match.win ? '3px solid #4CAFEB' : '3px solid #FF4C4C',
              height: '150px',
              minWidth: '125px',
              display: 'flex',
              flexShrink: 0,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#1E1E1E', 
              color: '#E0E0E0', 
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                backgroundColor: '#333333', // Hover effect
                cursor: 'pointer'
              },
            }}
          >
            <CardContent
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography sx={{ padding: 1, borderBottom: '1px solid white'}}>
                {match.role}
              </Typography>
              <Typography variant="h6" sx={{ marginTop: 1, fontWeight: 'bold', color: "#B8860B"  }}>
                {match.playerChampion}
              </Typography>
               <span style={{ padding: '10px' }}>vs</span>
              <Typography variant="body1" sx={{ marginTop: 1, color: "#B8860B" }}>
                {match.enemyChampion}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Box>
    </Box>
      </div>
    )

}

export default MatchList
