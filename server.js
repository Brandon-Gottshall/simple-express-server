// import dotenv
dotenv = require('dotenv')

// import Postgres
const { Pool } = require('pg')

// Setup dotenv
dotenv.config()

// Setup Postgres pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

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

// express.json
app.use(express.json())

// Setup port
const PORT = process.env.SERVER_PORT || process.env.PORT || 3001

// Setup Root Route (For testing)

app.get('/', (req, res) => {
  res.send(JSON.stringify('Best quote ever!'))
})

app.get('/new/:topic', async (req, res) => {
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

// Save quotes to database
app.post('/save', async (req, res) => {
  const client = await pool.connect()
  // Get quote from req
  const quote = req.body.quote
  // Save quote to database
  await client.query('INSERT INTO quotes (quote) VALUES ($1)', [quote])
  res.status(200).send('Quote saved!')
})

// Fetch all quotes

app.get('/quotes', async (req, res) => {
  const client = await pool.connect()
  const quotes = await client.query('SELECT * FROM quotes')
  res.send(quotes.rows)
})

// Delete quotes

app.delete('/delete/:id', async (req, res) => {
  const client = await pool.connect()
  const id = req.params.id
  await client.query('DELETE FROM quotes WHERE id = $1', [id])
  res.status(200).send('Quote deleted!')
})

// app.listen

app.listen(PORT, () => {
  console.log(JSON.stringify(`Server listening on port ${PORT}`))
})
