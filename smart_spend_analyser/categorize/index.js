const express = require('express');
const { json } = require('stream/consumers');
router = express.Router()
var mongo = require('mongodb');

const conn = require('../db/connect');

// Manual Categorization
/*
[ {
    localRecordId : {[
        {
            "amount": 100.5,
            "categoryId": "6311d7930feb4d269e155848"
        },
    ]}
  },
]
*/
router.post('/categorize',async function(req, res){
    let inputs = req.body.categorizeInput
    console.log(JSON.stringify(inputs))

    let track = []

    for(var i in inputs){
        let D = inputs[i] //JSON.parse(input)
        console.log(i,D)
    
        for(var TnxId in D){
            TnxData = D[TnxId]
            console.log(TnxData)
            console.log(TnxId)

            db = await conn()

            var o_id = mongo.ObjectID(TnxId);
            var query = { "_id": o_id }
            var newValues = { $set : {"categorized":TnxData} }

            // console.log(newValues)

            let response = await db.collection('transactions').updateOne(query ,newValues)
            // console.log(response)
            track.push(response)
        }
    }

    res.send(JSON.stringify(track));
});

router.post('/banklink',async function(req, res){
    // custom logic to prevent duplicate entries
    db = await conn()
    response = await db.collection('banklink').insertOne({"userId":1,"bankUserId":req.body.bankUserId,"bankId":req.body.bankId})
    res.send(JSON.stringify(response));
});

module.exports = router
