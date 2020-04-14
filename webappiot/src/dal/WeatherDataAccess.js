const MongoClient = require('mongodb').MongoClient;
module.exports = class WeatherDataAccess{
    mongodb_url = '';
    mongodb_db = '';
    mongodb_collection = '';

    constructor({url,db,col}) {
        this.mongodb_url = url;
        this.mongodb_db = db;
        this.mongodb_collection = col;
    }

    insert(weatherData){
        MongoClient.connect(this.mongodb_url, { useUnifiedTopology: true })
            .then(async (mongoClient) => {
                const col = mongoClient.db(this.mongodb_db).collection(this.mongodb_collection);
                console.log(`Connection BDD => OK | DB.COLLECTION => ${col.namespace}`);
                await col.insertOne(Object.assign({ date: Date.now() }, weatherData));
                await mongoClient.close();
            });
    }
};
