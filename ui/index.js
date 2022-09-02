const express = require('express')
router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(__dirname+'/home.html')
})

router.get('/ch', (req, res) => {
    res.sendFile(__dirname+'/chart.html')
})


module.exports = router