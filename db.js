const { Client } = require('pg')

//connect to db
const client = new Client({
    connectionString: process.env.DB_URL
})

client.connect()
.then(() => console.log('connected to DB!!'))
.catch(err => console.error('connection error', err))

module.exports = client