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
            MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true}, (dbError, mongoClient) => {
                if (dbError) {
                    reject("Connexion to database failed");
                    return;
                }
                mongoClient.db(this.mongodb_db).collection(this.mongodb_collection).insertOne(Object.assign({date: Date.now()}, weatherData), {}, (error, result) => {
                    if (error)
                        reject("No data inserted");
                    else
                        resolve(result);
                });
            });
        });
    }

    getCurrentData() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true}, (dbError, mongoClient) => {
                if (dbError) {
                    reject("Connexion to database failed");
                    return;
                }
                mongoClient.db(this.mongodb_db).collection(this.mongodb_collection).find({}, {
                    sort: {date: -1},
                    limit: 1
                }).toArray((error, result) => {
                    if (error)
                        reject("No data found");
                    else
                        resolve(result);
                    mongoClient.close();
                });
            });
        });
    }

    getDataForPeriod(startTime, endTime) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true}, (dbError, mongoClient) => {
                if (dbError) {
                    reject("Connexion to database failed");
                    return;
                }
                mongoClient.db(this.mongodb_db).collection(this.mongodb_collection).find({
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
                    mongoClient.close();
                });
            });
        });
    }

    getCityDataForPeriod(startTime, endTime, cityName) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true}, (dbError, mongoClient) => {
                if (dbError) {
                    reject("Connexion to database failed");
                    return;
                }
                mongoClient.db(this.mongodb_db).collection(this.mongodb_collection).find({
                    $and: [{
                        date: {$gte: startTime},
                        cities: {$elemMatch: {name: cityName}}
                    }, {
                        date: {$lte: endTime},
                        cities: {$elemMatch: {name: cityName}}
                    }]
                }).toArray((error, result) => {
                    if (error)
                        reject("No data found");
                    else
                        resolve(result);
                    mongoClient.close();
                });
            });
        });
    }
};