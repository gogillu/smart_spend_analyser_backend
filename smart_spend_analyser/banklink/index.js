const express = require('express')
router = express.Router()

const conn = require('../db/connect');

router.get('/banklink',async function(req, res){
    db = await conn()
    response = await db.collection('banklink').find().toArray()
    res.send(JSON.stringify(response));
});

router.post('/banklink',async function(req, res){
    // custom logic to prevent duplicate entries
    db = await conn()
    response = await db.collection('banklink').insertOne({"userId":1,"bankUserId":req.body.bankUserId,"bankId":req.body.bankId})
    res.send(JSON.stringify(response));
});

module.exports = router
