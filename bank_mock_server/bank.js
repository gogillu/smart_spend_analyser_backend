const express = require('express')
router = express.Router()

router.post('/fetch', function(req, res){
    console.log("bank api is hit")
    console.log(req.body)
    const fs = require('fs');

    let rawdata = fs.readFileSync('./bank_mock_server/transactions.json');
    let tnx = JSON.parse(rawdata);
    // console.log(tnx);
    res.send(JSON.stringify(tnx));
});

module.exports = router
