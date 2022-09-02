const express = require('express')
const dotenv = require('dotenv')
var bodyParser = require('body-parser')

const app = express()
const port = 3000
dotenv.config()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const bank = require('./bank_mock_server/bank')
app.use('/bank',bank)

const ssaCategory = require('./smart_spend_analyser')
app.use('/ssa',ssaCategory)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})