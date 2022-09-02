const express = require('express')
router = express.Router()

const conn = require('../db/connect');
var mongo = require('mongodb');
const bankServer = process.env.BANK_SERVER
const fetchEndpoint = process.env.FETCH_ENDPOINT

const Axios = require('Axios');

function getBankEndpoint(bankId){
    return bankServer+fetchEndpoint
}

async function fetch(bankId, userId, bankUserId, from, to){
    console.log(bankServer+fetchEndpoint)

    // call bank mock server
    const fetchedData = await Axios({
        method: 'post',
        url: getBankEndpoint(bankId),
        headers: { Authorization: "dummy"},
        data: {
            "customerId" : bankUserId,
            "from": from,
            "to": to
        }
    })

    
    console.log(fetchedData)
    // return fetchedData.data

    // query local tnx in time frame
    db = await conn()
    response = await db.collection('transactions').find().toArray()
    res.send(JSON.stringify(response));

    // update local transactions

    // db = await conn()
    // response = await db.collection('transactions').find().toArray()
    // res.send(JSON.stringify(response));
}

async function getLocalTransactions(userId,bankUserId,bankId,from,to){
    db = await conn()
    localTnx = await db.collection('transactions').find(
        {
            "userId":userId,
            "bankUserId":bankUserId,
            "bankId":bankId,
            "timestamp": {
                $gt:new Date(from),
                $lt:new Date(to)
            },
        }).toArray()
    return localTnx
}

router.get('/fetch',async function(req, res){
    const resp = await fetch(1,2,3,4,5)
    console.log(resp,"----")
    res.send(JSON.stringify(resp))
});

router.get('/test',async function(req, res){
    db = await conn()
    response = await db.collection('transactions').insertOne(
        {
            "userId":1,
            "bankUserId":"A123",
            "bankId":1,
            "tnxId": 11111,
            "timestamp": new Date("2022-09-02 10:00:00"),
            "amount": 100.5,
            "tnxType": "debit",
            "method": "UPI",
            "remark": "Lunch at udupi",
            "to": "893475934785894"
        }).toArray()
    res.send(JSON.stringify(response));
});

router.get('/query',async function(req, res){
    db = await conn()
    localTnx = await db.collection('transactions').find(
        {
            "userId":1,
            "bankUserId":"A123",
            "bankId":1,
            "timestamp": {
                $gt:new Date("2022-09-02 09:00:00"),
                $lt:new Date("2022-09-02 10:00:01")
            },
        }).toArray()
    res.send(JSON.stringify(localTnx));
});

router.post('/banklink',async function(req, res){
    // custom logic to prevent duplicate entries
    db = await conn()
    response = await db.collection('banklink').insertOne({"userId":1,"accountNo":req.body.accountNo,"bankId":req.body.bankId})
    res.send(JSON.stringify(response));
});

module.exports = router
