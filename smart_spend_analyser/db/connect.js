const MongoClient = require('mongodb').MongoClient

const mockMongo = require('mongo-mock')
mockMongo.max_delay = 0
var mockMongoClient = mockMongo.MongoClient
MongoClient.persists='mongo.js'

connectionString = process.env.DB_URL

var n = 0;
var database = 'nA';

async function connect(){
    if(process.env.Test == 'true'){
        if(n==0){
            try{
                var client = await mockMongoClient.connect(connectionString, {})
                database = client.db()
                n++
                return database
            }catch(e){
                console.log(e)
                process.exit(1)
            }    
        }else{
            return database
        }
    }else if(n==0){
        var client = await MongoClient.connect(
            connectionString
        ,   { 
                useUnifiedTopology: true
            // ,   poolSize: 10
            }
        )
        console.log('mongo connection created '+Date.now())
        n++
        console.log(n)
        database = client.db()
        return database

    }else if(n>1){
        console.log('connections more than 1')
    }
    return await database
}

connect()
module.exports = connect
