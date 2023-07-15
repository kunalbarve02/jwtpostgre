const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const db = require('./db')

//init app
const app = express()
const port = 8000

//middlewares
app.use(express.json()) 
app.use(cors({origin:'*'}))
app.use(cookieParser())

//routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')

app.use('/', authRoutes)
app.use('/', userRoutes)

if (process.env.NODE_ENV == 'test') {
    app.listen(0, () => console.log(`app listening on port 0!`))
}
else
{
    app.listen(port, () => console.log(`app listening on port ${port}!`))
}

module.exports = app
