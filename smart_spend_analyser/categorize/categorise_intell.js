const express = require('express')
router = express.Router()

const conn = require('../db/connect');
userId = 1

StandardCatMap = {
    "lunch": "food",
    "dinner": "food",
    "auto": "travel",
    "cab": "travel",
    "rapido": "travel",
    "shirt": "outfit",
    "jeans": "outfit",
    "supermarket": "groceries",
    "water": "water",
    "groceries": "groceries"
}

async function getCategoryIdBasedOnRemark(remark){

    categorized = false
    categorizedString = "none"
    for(var key in StandardCatMap){
        category = StandardCatMap[key]

        if(remark.includes(key)){
            categorizedString = category
            categorized = true
        }
    }

    if(categorized){
        db = await conn()
        let response = await db.collection('categories').find({category:categorizedString}).toArray()

        console.log(response)
        if(response.length > 0){
            console.log(response.length)
            console.log(response[0]._id)
            return [true,response[0]._id]    
        }else{
            let insertedRow = await db.collection('categories').insertOne({"userId":userId,"category":categorizedString,"toType":false,"toVal":"NA"})
            
            console.log(insertedRow)
            return [true,insertedRow.insertedId]
        }
    }

    return [false,0]
};

module.exports.getCategoryIdBasedOnRemark = getCategoryIdBasedOnRemark