const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());

app.use(express.json());

const TRIPADVISOR_API_KEY = 'B13358799FEA495583719DE6B9CA870C';
const TRIPADVISOR_BASE_URL = 'https://api.content.tripadvisor.com/api/v1';


const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Referer': 'https://travel-guidance.app',
    'Origin': 'https://travel-guidance.app'
};

//Search the location's locationID
app.get('/api/location/search', async (req, res) => {
    try {
        const { searchQuery, category, country } = req.query;
        const response = await axios.get(`${TRIPADVISOR_BASE_URL}/location/search`, {
            params: {
                key: TRIPADVISOR_API_KEY,
                searchQuery,
                ...(category && { category }),
                ...(country && { country })
            },
            headers
        });
        res.json(response.data);
    } catch (error) {
        console.error('An error occurred while searching for a location:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message
        });
    }
});

//Seach location's detail, like name, phone number, and feature by its locationID
app.get('/api/location/:locationId/details', async (req, res) => {
    try {
        const { locationId } = req.params;
        const response = await axios.get(`${TRIPADVISOR_BASE_URL}/location/${locationId}/details`, {
            params: {
                key: TRIPADVISOR_API_KEY,
                currency: 'CAD'
            },
            headers
        });
        res.json(response.data);
    } catch (error) {
        console.error('An error occurred while searching for a location detail:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message
        });
    }
});

//Search location's photo by its locationID
app.get('/api/location/:locationId/photos', async (req, res) => {
    try {
        const { locationId } = req.params;
        const response = await axios.get(`${TRIPADVISOR_BASE_URL}/location/${locationId}/photos`, {
            params: {
                key: TRIPADVISOR_API_KEY,
                language: 'en',
                limit:1
            },
            headers
        });
        res.json(response.data);
    } catch (error) {
        console.error('An error occurred while getting the location photo:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message
        });
    }
});


module.exports = app;


if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}