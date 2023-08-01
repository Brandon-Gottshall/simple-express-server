// import dotenv
dotenv = require('dotenv')

// Setup dotenv
dotenv.config()

// Setup Express server
const express = require('express')

// Setup Express app
const app = express()

// Setup cors
const cors = require('cors')

// Setup cors
app.use(
  cors({
    origin: 'localhost',
  })
)

// Setup port
const PORT = process.env.SERVER_PORT || process.env.PORT || 3001

// Setup Root Route (For testing)

app.get('/', (req, res) => {
  res.send('Best quote ever!')
})

// app.listen

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
