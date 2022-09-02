const express = require('express')
router = express.Router()

router.post('/fetch', function(req, res){
    console.log("bank api is hit")
    console.log(req.body)

    user_id = req.body.user_id
    from = req.body.from
    to = req.body.to

    const fs = require('fs');

    let rawdata = fs.readFileSync('./bank_mock_server/transactions.json');
    let allTnx = JSON.parse(rawdata);

    let filteredTnx = []

    for(var i in allTnx){
        tnx = allTnx[i]
        console.log(i,tnx)
        console.log(new Date(from) <= new Date(tnx.timestamp))
        console.log(new Date(tnx.timestamp) <= new Date(to))
        console.log(tnx.user_id == user_id)
        if(
            new Date(from) <= new Date(tnx.timestamp) && 
            new Date(tnx.timestamp) <= new Date(to) && 
            tnx.user_id == user_id){
                filteredTnx.push(tnx)
        }
    }

    // console.log(tnx);
    res.send(JSON.stringify(filteredTnx));
});

module.exports = router
