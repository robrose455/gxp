import { Box, TextField, Button } from '@mui/material'
import React, { useState } from 'react'
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { getMatchPreviews } from '../../riot.api';
import { MatchPreview } from '../../types';

interface AccountSelectProps {
    setMatchPreviews: Dispatch<SetStateAction<MatchPreview[]>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setAccountId: Dispatch<SetStateAction<string>>;
    setAccountDisplay: Dispatch<SetStateAction<string>>;
    loading: boolean;
}

const AccountSelect: React.FC<AccountSelectProps> = ({ setMatchPreviews, setLoading, setAccountId, setAccountDisplay, loading }) => {

    const [accountName, setAccountName] = useState('');
    const [accountTag, setAccountTag] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        const matchPreviews = await getMatchPreviews(accountName, accountTag);
        setAccountDisplay(`${accountName} #${accountTag}`)
        setAccountId(matchPreviews[0].accountId);
        setLoading(false);
        setMatchPreviews(matchPreviews);
    };

    return (
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#121212',
                gap: 2,
                padding: 4,
                borderRadius: 1,
                width: 'fit-content',
                margin: 'auto',
            }}
        >
            <TextField
                label="Account"
                variant="outlined"
                placeholder="T1 Faker"
                onChange={(e) => setAccountName(e.target.value)}
                InputProps={{
                    style: { backgroundColor: '#1E1E1E', color: '#E0E0E0' },
                }}
                InputLabelProps={{
                    style: { color: '#9E9E9E' },
                }}
                sx={{ 
                    flex: 1 
                }}
            />
            <TextField
                label="Tag"
                variant="outlined"
                placeholder="NA1"
                onChange={(e) => setAccountTag(e.target.value)}
                InputProps={{
                    style: { backgroundColor: '#1E1E1E', color: '#E0E0E0' },
                }}
                InputLabelProps={{
                    style: { color: '#9E9E9E' },
                }}
                sx={{ 
                    flex: 1 
                }}
            />
            <Button
                variant="contained"
                onClick={(e) => handleSubmit(e)}
                sx={{ backgroundColor: "#B8860B", color: "#FFFFFF", flexShrink: 0 }}
            >
                Find Matches
            </Button>
        </Box>
    )
}

export default AccountSelect
