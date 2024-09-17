import conf from "../config/conf.js";
import axios from "axios";
import express from "express";
import logger from "../logFile/logger.js";



const router = express.Router();

// Replace with the correct API URL and include the API key in the query string
// const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${conf.api_Key}`;
const URL = `${conf.api_Url} ${conf.api_Key}`;

router.post('/chatBot',async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    logger.error('No prompt provided');
    return res.status(400).send({ error: 'Message is required' });
  }

  try {
    // Make the POST request to the API
    const response = await axios.post(URL, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Extract the content of the response
    const botResponse = response.data?.candidates?.[0]?.content?.parts
  ? response.data.candidates[0].content.parts.map(part => part.text).join(' ')
  : 'No response available.';

  
    // Log the full response for debugging
    // console.log('API Response:', JSON.stringify(response.data));

    // Send the generated response back to the client
    logger.info('API Response generated successfully');
    return res.status(200).send({ answer: botResponse });
    
  } catch (error) {
    logger.error('Error while generating content:', error);
    return res.status(500).send({ error: 'An error occurred while generating the message' });
  }
});

export default router;