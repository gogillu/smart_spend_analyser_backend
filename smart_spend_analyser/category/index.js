const express = require('express')
router = express.Router()

const conn = require('../db/connect');
var mongo = require('mongodb');

router.get('/category',async function(req, res){
    console.log("category api is hit")

    db = await conn()
    response = await db.collection('categories').find().toArray()
    res.send(JSON.stringify(response));
});

router.post('/category',async function(req, res){
    console.log("category api is hit")

    db = await conn()
    response = await db.collection('categories').insertOne({"userId":1,"category":req.body.category})
    res.send(JSON.stringify(response));
});

module.exports = router
