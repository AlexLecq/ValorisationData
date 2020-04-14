const MongoClient = require('mongodb').MongoClient;
module.exports = class WeatherDataAccess {
    mongodb_url = '';
    mongodb_db = '';
    mongodb_collection = '';

    constructor({url, db, col}) {
        this.mongodb_url = url;
        this.mongodb_db = db;
        this.mongodb_collection = col;
    }

    insert(weatherData) {
        MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true})
            .then(async (mongoClient) => {
                const col = mongoClient.db(this.mongodb_db).collection(this.mongodb_collection);
                console.log(`Connection BDD => OK | DB.COLLECTION => ${col.namespace}`);
                await col.insertOne(Object.assign({date: Date.now()}, weatherData));
                await mongoClient.close();
            });
    }

    async getDataForPeriod(startTime, endTime) {
        const mongoClient = await MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true});
        const col = mongoClient.db(this.mongodb_db).collection(this.mongodb_collection);
        const result = await col.find({
            $and: [{
                date: {$gte: startTime}
            }, {
                date: {$lte: endTime}
            }]
        });
        await mongoClient.close();
        return result;
    }

    async getCityDataForPeriod(startTime, endTime, cityName) {
        const mongoClient = await MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true});
        const col = mongoClient.db(this.mongodb_db).collection(this.mongodb_collection);
        const result = await col.find({
            $and: [{
                date: {$gte: startTime},
                cities: {name: cityName}
            }, {
                date: {$lte: endTime},
                cities: {name: cityName}
            }]
        });
        await mongoClient.close();
        return result;
    }
};
