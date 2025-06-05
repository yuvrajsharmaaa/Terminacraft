const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
    console.log('API route hit:', req.method, req.url);
    console.log('Request body:', req.body);

    if (req.method !== 'POST') {
        console.log('Method not allowed:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        console.log('No message provided in request');
        return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key exists
    if (!process.env.HUGGINGFACE_API_KEY) {
        console.error('HUGGINGFACE_API_KEY is not set');
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";
        const headers = {
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
        };
        const prompt = `You are Steve from Minecraft, a sarcastic assistant in a terminal game. Roast the player based on the command.\nPlayer: ${message}\nSteve:`;
        const body = JSON.stringify({
            inputs: prompt,
            parameters: {
                max_new_tokens: 100,
                temperature: 0.7
            }
        });
        console.log('Sending request to Hugging Face Inference API...');
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body
        });
        const data = await response.json();
        console.log('Received response from Hugging Face API:', data);
        if (data.error) {
            throw new Error(data.error);
        }
        // Extract Steve's reply
        let reply = data.generated_text || (Array.isArray(data) && data[0]?.generated_text) || "Oops, Steve's pickaxe broke.";
        reply = reply.split('Steve:')[1]?.trim() || reply.trim();
        return res.status(200).json({ reply });
    } catch (error) {
        console.error('Error in chat handler:', error);
        return res.status(500).json({ 
            error: 'Failed to generate response',
            details: error.message
        });
    }
}
