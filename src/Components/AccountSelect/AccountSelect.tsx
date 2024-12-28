import { Box, TextField, Button } from '@mui/material'
import React, { useState } from 'react'
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface AccountSelectProps {
    setAccountName: Dispatch<SetStateAction<string>>;
    setAccountTag: Dispatch<SetStateAction<string>>;
}

const AccountSelect: React.FC<AccountSelectProps> = ({ setAccountName, setAccountTag }) => {

    const [accountNameForm, setAccountNameForm] = useState('');
    const [accountTagForm, setAccountTagForm] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setAccountName(accountNameForm);
        setAccountTag(accountTagForm);
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
                onChange={(e) => setAccountNameForm(e.target.value)}
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
                onChange={(e) => setAccountTagForm(e.target.value)}
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
