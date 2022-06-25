const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000

connectDB()

const app = express()
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/auth', require('./routes/authRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
