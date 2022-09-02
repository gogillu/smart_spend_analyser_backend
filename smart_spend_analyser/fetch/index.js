const express = require('express')
router = express.Router()

const conn = require('../db/connect');
var mongo = require('mongodb');
const bankServer = process.env.BANK_SERVER
const fetchEndpoint = process.env.FETCH_ENDPOINT

const categorizer = require('../categorize/categorise_intell')

const Axios = require('Axios');

function getBankEndpoint(bankId){
    return bankServer+fetchEndpoint
}

bankId = 1
userId = 1
bankUserId = "abc"

async function fetch(bankId, bankUserId, from, to){
    console.log(bankServer+fetchEndpoint)

    const fetchedData = await Axios({
        method: 'post',
        url: getBankEndpoint(bankId),
        headers: { Authorization: "dummy"},
        data: {
            "user_id" : bankUserId,
            "from": from,
            "to": to
        }
    })
    
    console.log(fetchedData)
    console.log('--------')
    return fetchedData.data
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

    indexedLocalTnx = {}
    localTnx.forEach(tnx => {
        indexedLocalTnx[tnx.tnxId] = tnx
    })

    return indexedLocalTnx
}

async function updateLocalTransactions(userId, bankId, indexedLocalTnx, fetchedTnx){
    newTnx = []

    fetchedTnx.forEach(tnx => {
        let isNew = !indexedLocalTnx[tnx.tnx_id]
        console.log('isNew',isNew)
        if(isNew){
            newTnx.push({
                "userId":userId,
                "bankUserId":tnx.user_id,
                "bankId":bankId,
                "tnxId": tnx.tnx_id,
                "timestamp": new Date(tnx.timestamp),
                "amount": tnx.amount,
                "tnxType": tnx.tnx_type,
                "method": tnx.method,
                "remark": tnx.remark,
                "to": tnx.to
            })
        }
    });

    let response = []
    if(newTnx.length > 0){
        db = await conn()
        console.log(newTnx)
        // return newTnx
        response = await db.collection('transactions').insertMany(newTnx)    
    }

    return response
}

router.post('/fetchAndUpdateLocal',async function(req, res){

    from = req.body.from //|| "2022-08-31T10:00:00"
    to = req.body.to //|| "2022-09-03T10:00:00"

    // call bank mock server
    const fetchedData = await fetch(bankId, bankUserId, from, to)

    // query local tnx in time frame
    const indexedLocalTnx = await getLocalTransactions(userId,bankUserId,bankId,from,to)
    // console.log(indexedLocalTnx)

    // update local transactions
    const resp = await updateLocalTransactions(userId, bankId, indexedLocalTnx, fetchedData)

    // console.log(resp,"----")
    res.send(JSON.stringify(resp))
});        


router.get('/getTnx',async function(req, res){
    db = await conn()
    localTnx = await db.collection('transactions').find(
        // {
        //     "userId":1,
        //     "bankUserId":"A123",
        //     "bankId":1,
        //     "timestamp": {
        //         $gt:new Date("2022-09-02 09:00:00"),
        //         $lt:new Date("2022-09-02 10:00:01")
        //     },
        // }
    ).toArray()
    res.send(JSON.stringify(localTnx));
});

router.get('/testCategorizeFromRemark',async function(req, res){
    let data = await categorizer.getCategoryId("shirt")
    res.send(JSON.stringify(data));
});


// router.post('/banklink',async function(req, res){
//     // custom logic to prevent duplicate entries
//     db = await conn()
//     response = await db.collection('banklink').insertOne({"userId":1,"accountNo":req.body.accountNo,"bankId":req.body.bankId})
//     res.send(JSON.stringify(response));
// });

module.exports = router

// router.get('/test',async function(req, res){
//     db = await conn()
//     response = await db.collection('transactions').insertOne(
//         {
//             "userId":1,
//             "bankUserId":"A123",
//             "bankId":1,
//             "tnxId": 11111,
//             "timestamp": new Date("2022-09-02 10:00:00"),
//             "amount": 100.5,
//             "tnxType": "debit",
//             "method": "UPI",
//             "remark": "Lunch at udupi",
//             "to": "893475934785894"
//         }).toArray()
//     res.send(JSON.stringify(response));
// });
