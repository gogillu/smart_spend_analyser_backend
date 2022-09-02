const express = require('express')
router = express.Router()

const conn = require('../db/connect');
userId = 1

async function getCategoryIdBasedOnToAcc(toAcc){

    db = await conn()
    let response = await db.collection('categories').find({toType:true,toVal:toAcc,userId:userId}).toArray()

    console.log(response,response.length)
    if(response.length > 0){
        console.log(response.length)
        console.log(response[0]._id)
        return [true,response[0]._id]    
    }

    return [false,0]
};

module.exports.getCategoryIdBasedOnToAcc = getCategoryIdBasedOnToAcc