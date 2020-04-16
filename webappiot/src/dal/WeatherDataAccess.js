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

    async insert(weatherData) {
        return new Promise(async (resolve, reject) => {
            let mongoClient;
            try {
                mongoClient = await MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true});
            } catch (e) {
                reject("Connexion to database failed");
                return;
            }
            const col = mongoClient.db(this.mongodb_db).collection(this.mongodb_collection);
            if (col) {
                col.insertOne(Object.assign({date: Date.now()}, weatherData), {}, (error, result) => {
                    if (error)
                        reject("No data inserted");
                    else
                        resolve(result);
                });
            } else {
                reject("MongoDB collection doesn't exist");
            }
            await mongoClient.close();
        });
    }

    async getCurrentData() {
        return new Promise(async (resolve, reject) => {
            let mongoClient;
            try {
                mongoClient = await MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true});
            } catch (e) {
                reject("Connexion to database failed");
                return;
            }
            const col = mongoClient.db(this.mongodb_db).collection(this.mongodb_collection);
            if (col) {
                col.find({}, {sort: {date: -1}, limit: 1}).toArray((error, result) => {
                    if (error)
                        reject("No data found");
                    else
                        resolve(result);
                });
            } else {
                reject("MongoDB collection doesn't exist");
            }
            await mongoClient.close();
        });
    }

    getDataForPeriod(startTime, endTime) {
        return new Promise(async (resolve, reject) => {
            let mongoClient;
            try {
                mongoClient = await MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true});
            } catch (e) {
                reject("Connexion to database failed");
                return;
            }
            const col = mongoClient.db(this.mongodb_db).collection(this.mongodb_collection);
            if (col) {
                col.find({
                    $and: [{
                        date: {$gte: startTime}
                    }, {
                        date: {$lte: endTime}
                    }]
                }).toArray((error, result) => {
                    if (error)
                        reject("No data found");
                    else
                        resolve(result);
                });
            } else {
                reject("MongoDB collection doesn't exist");
            }
            await mongoClient.close();
        });
    }

    getCityDataForPeriod(startTime, endTime, cityName) {
        return new Promise(async (resolve, reject) => {
            let mongoClient;
            try {
                mongoClient = await MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true});
            } catch (e) {
                reject("Connexion to database failed");
                return;
            }
            const col = mongoClient.db(this.mongodb_db).collection(this.mongodb_collection);
            if (col) {
                col.findOne({
                    $and: [{
                        date: {$gte: startTime},
                        cities: {name: cityName}
                    }, {
                        date: {$lte: endTime},
                        cities: {name: cityName}
                    }]
                }, (error, result) => {
                    if (error)
                        reject("No data found");
                    else
                        resolve(result);
                });
            } else {
                reject("MongoDB collection doesn't exist");
            }
            await mongoClient.close();
        });
    }
};
