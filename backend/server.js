// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Updated endpoint for speech-to-text
app.post('/api/stt', upload.single('audio'), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append('content', req.file.buffer, { filename: 'recording.wav' });
        formData.append('language', 'yo');

        const response = await axios.post('https://api.spi-tch.com/v1/transcriptions', formData, {
            headers: { 
                'Authorization': `Bearer ${process.env.SPITCH_API_KEY}`,
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error in STT:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Speech recognition failed' });
    }
});

// Endpoint for processing text (placeholder - adjust according to actual API)
app.post('/api/process', async (req, res) => {
    // Implement text processing logic here
    res.json({ response: "Processed text response" });
});

// Endpoint for text-to-speech (placeholder - adjust according to actual API)
app.post('/api/tts', async (req, res) => {
    // Implement text-to-speech logic here
    res.json({ audio_url: "URL to audio file" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});