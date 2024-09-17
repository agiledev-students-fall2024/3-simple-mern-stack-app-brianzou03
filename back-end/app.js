require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// route to handle the about us page
app.get('/about', (req, res) => {
  res.json({
    paragraphs: [
      "Hello, my name is Brian Zou. I am a computer science student \
      at New York University. Besides computer science, I am also interested in \
      creative writing as well as the arts. I decided to take the AGILE course \
      to help expand my knowlege of the AGILE workflow and process, as well as to work \
      on an awesome project with some friends.",

      "A fun hobby of mine is drawing - I enjoy drawing characters from popular media \
      as well as drawing friends and such. I also enjoy dancing, although my dance skills are very \
      lackluster. While I don't consider this to be a hobby, I also enjoy going out in the city \
      and thrifting at the many boutique and upcycling stores in the city. It's a great \
      way to help the environment while getting some cool new fashionable wear.",

      "Another well known fact about me is my obsession for matcha. Matcha is one of my favorite drinks \
      because of its versatility and very savory nature. I don't mind other tea lattes, but \
      they don't hold a candle to the 'grassy' flavor of matcha. I heard that people don't like \
      matcha because of that so-called grassy flavor, but I think that the somewhat earthy yet rich taste \
      is what makes matcha so delightful!"
    ],
    image: "/brian_zou_picture.png"
  })
})

// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
