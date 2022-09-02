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

    let userId = 1
    let category = req.body.category
    let toType = req.body.toType || false
    let toVal = req.body.toVal || "NA"

    db = await conn()
    response = await db.collection('categories').insertOne({"userId":userId,"category":category,"toType":toType,"toVal":toVal})
    res.send(JSON.stringify(response));
});

module.exports = router
