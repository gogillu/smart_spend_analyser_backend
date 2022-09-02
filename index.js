const express = require('express')
const app = express()
const port = 3000

const bank = require('./bank_mock_server/bank')
app.use('/bank',bank)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})