const express = require('express')
router = express.Router()

category = require('./category')
banklink = require('./banklink')
fetchData = require('./fetch')

module.exports = [
    category
,   banklink
,   fetchData
]