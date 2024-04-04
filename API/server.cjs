const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/api/matches', async (req, res) => {
    const today = new Date();
    const dateFrom = today.toISOString().split('T')[0]; // Get today's date in "YYYY-MM-DD" format
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 5); // Set date to tomorrow
    const dateTo = tomorrow.toISOString().split('T')[0]; // Get tomorrow's date in "YYYY-MM-DD" format
    const competitionIds = 'PL,CL,UEL,SA,FAC,PD,CDR,FL1,BL1'; // PD,CDR,FL1,BL1,

    const apiUrl = `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&competitions=${competitionIds}`;
    const apiToken = '2c3a1f0b83934571876df398e53eb381'; // Replace with your actual API token

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Auth-Token': apiToken,
            },
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error making API request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/standings', async (req, res) => {
    const competitionIds = 'PL,DED,CL,EL,PD,FL1,BL1,SA,PPL,ELC,FAC';
   // const apiUrl = `https://api.football-data.org/v4/competitions/${competitionIds}/standings`;
    const apiToken = '2c3a1f0b83934571876df398e53eb381'; // Replace with your actual API token

    try {
        const standingsData = await Promise.all(competitionIds.split(',').map(async (competitionId) => {
            const apiUrl = `https://api.football-data.org/v4/competitions/${competitionId}/standings`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-Auth-Token': apiToken,
                },
            });
            const data = await response.json();
            return data;
        }));

        res.json(standingsData);
    } catch (error) {
        console.error('Error making API request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
