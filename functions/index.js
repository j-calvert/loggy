'use strict';

const functions = require('firebase-functions');
const openaiAPI = require('openai');

const configuration = new openaiAPI.Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openaiAPI.OpenAIApi(configuration);

const cors = require('cors')({
  origin: true,
});

// The remotely executed function called 'generate'
exports.generate = functions.https.onRequest((req, res) => {
  if (req.method === 'PUT') {
    res.status(403).send('Forbidden!');
    return;
  }
  cors(req, res, () => {
    if (!configuration.apiKey) {
      res.status(500).json({
        error: {
          message:
            'OpenAI API key not configured, please follow instructions in README.md',
        },
      });
      return;
    }

    const transcript = req.body.transcript || '';

    const prompt = generatePrompt(transcript);
    console.log(`prompt ${prompt}`);
    const completion = openai
      .createCompletion({
        model: 'text-davinci-003',
        prompt: generatePrompt(transcript),
        temperature: 0.6,
        max_tokens: 100,
      })
      .then((completion) =>
        res.status(200).json({ result: completion.data.choices[0].text })
      )
      .catch((error) => {
        // TODO: Something better
        if (error.response) {
          console.error(error.response.status, error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
          res.status(500).json({
            error: {
              message: 'An error occurred during your request.',
            },
          });
        }
      });
  });
});

// Helper. TODO: Prompt "engineering"
function generatePrompt(transcript) {
  return `The following is a conversation between Me and a snarky AI 

${transcript}
AI: `;
}
