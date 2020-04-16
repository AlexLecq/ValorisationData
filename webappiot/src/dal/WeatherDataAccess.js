const MongoClient = require('mongodb').MongoClient;
module.exports = class WeatherDataAccess {
     mongodb_url = '';
     mongodb_db = '';
     mongodb_collection = '';

     constructor({ url, db, col }) {
          this.mongodb_url = url;
          this.mongodb_db = db;
          this.mongodb_collection = col;
     }

    /***
     * Insére les données dans la base MongoDB
     * @returns {Promise}
     */
    insert(weatherData) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true}, (dbError, mongoClient) => {
                if (dbError) {
                    reject('Connexion to database failed');
                    return;
                }
                mongoClient.db(this.mongodb_db).collection(this.mongodb_collection).insertOne(Object.assign({date: Date.now()}, weatherData), {}, (error, result) => {
                    if (error)
                        reject('No data inserted');
                    else
                        resolve();
                });
            });
        });
    }

    /***
     * Retourne les dernières données de toutes les villes
     * @returns {Promise}
     */
     getCurrentData() {
          return new Promise((resolve, reject) => {
               MongoClient.connect(this.mongodb_url, { useUnifiedTopology: true }, (dbError, mongoClient) => {
                    if (dbError) {
                         reject('Connexion to database failed');
                         return;
                    }
                    mongoClient.db(this.mongodb_db).collection(this.mongodb_collection).find({}, {
                         sort: { date: -1 },
                         limit: 1
                    }).toArray((error, result) => {
                         if (error)
                              reject('No data found');
                         else
                              resolve(result);
                         mongoClient.close();
                    });
               });
          });
     }

    /***
     * Retourne l'ensemble des données de toutes les villes sur une période
     * @param startTime Timestamp
     * @param endTime Timestamp
     * @returns {Promise}
     */
     getDataForPeriod(startTime, endTime) {
          return new Promise((resolve, reject) => {
               MongoClient.connect(this.mongodb_url, { useUnifiedTopology: true }, (dbError, mongoClient) => {
                    if (dbError) {
                         reject('Connexion to database failed');
                         return;
                    }
                    mongoClient.db(this.mongodb_db).collection(this.mongodb_collection).find({
                         $and: [{
                              date: { $gte: startTime }
                         }, {
                              date: { $lte: endTime }
                         }]
                    }).toArray((error, result) => {
                         if (error)
                              reject('No data found');
                         else
                              resolve(result);
                         mongoClient.close();
                    });
               });
          });
     }

    /***
     * Retourne l'ensemble des données pour une ville sur une période
     * @param startTime Timestamp
     * @param endTime Timestamp
     * @param cityName String
     * @returns {Promise}
     */
    getCityDataForPeriod(startTime, endTime, cityName) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.mongodb_url, {useUnifiedTopology: true}, (dbError, mongoClient) => {
                if (dbError) {
                    reject('Connexion to database failed');
                    return;
                }
                mongoClient.db(this.mongodb_db).collection(this.mongodb_collection).find({
                    $and: [{
                        date: {$gte: startTime},
                    }, {
                        date: {$lte: endTime},
                    }]
                }).toArray((error, result) => {
                    if (error)
                        reject('No data found');
                    else {
                        let realResult = [];
                        for (let oneData of result)
                            realResult.push({
                                date: oneData.date,
                                city: oneData.cities.find((city) => city.name === cityName)
                            });
                        resolve(realResult);
                    }
                    mongoClient.close();
                });
            });
        });
    }
};