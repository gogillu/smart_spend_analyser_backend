const express = require('express')
router = express.Router()

category = require('./category')
banklink = require('./banklink')
fetchData = require('./fetch')
categorizeManual = require('./categorize')

module.exports = [
    category
,   banklink
,   fetchData
,   categorizeManual
]