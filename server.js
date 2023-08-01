// import dotenv
dotenv = require('dotenv')

// Setup dotenv
dotenv.config()

// Setup OpenAI client
const { OpenAIApi, Configuration } = require('openai')
// Configure OpenAI client
const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openai = new OpenAIApi(config)

// Setup Express server
const express = require('express')

// Setup Express app
const app = express()

// Setup cors
const cors = require('cors')

// Setup cors
app.use(cors((origin = '*')))

// Setup port
const PORT = process.env.SERVER_PORT || process.env.PORT || 3001

// Setup Root Route (For testing)

app.get('/', (req, res) => {
  res.send(JSON.stringify('Best quote ever!'))
})

app.get('/new/:topic', (req, res) => {
  // Get topic from request
  const topic = req.params.topic
  // OpenAI Chat Completion
  const completion = openai
    .createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Generate a short quote for the following topic: ${topic}.`,
        },
      ],
    })
    .then((response, err) => {
      if (err) {
        console.log(JSON.stringify(err))
      }
      console.log(response.data.choices[0].message.content)
      res.send(response.data.choices[0].message.content)
    })
})

// app.listen

app.listen(PORT, () => {
  console.log(JSON.stringify(`Server listening on port ${PORT}`))
})
