const express = require('express')
const ErrorHandler = require('./middleware/Error')
var cookieParser = require('cookie-parser')
const app = express()
app.use(express.json())
app.use(cookieParser())



// Route Import

const product = require('./routes/product')
const user = require('./routes/user')
const order = require('./routes/order')


app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)

// middleware for Error

app.use(ErrorHandler)

module.exports = app