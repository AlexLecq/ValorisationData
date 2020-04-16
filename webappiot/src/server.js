require('dotenv').config();
const mqtt = require('mqtt');
const express = require('express');
const app = express();
const WeatherDataAccess = require('./dal/WeatherDataAccess');
const weatherDataClient = new WeatherDataAccess({
    url: process.env.MONGODB_URL,
    db: process.env.MONGODB_DB,
    col: process.env.MONGODB_COL,
});
let mqttClient;
try {
    mqttClient = mqtt.connect(process.env.MQTT_URL);
} catch (e) {
    console.error('un problème est survenue lors de la connexion au serveur MQTT : ' + e);
}

app.use(express.json());
app.use(express.static('public'));
app.listen(process.env.PORT);

mqttClient.on('connect', () => {
    console.log('Connection serveur MQTT => OK');
});

mqttClient.subscribe(process.env.MQTT_TOPIC, (err) => {
    if (err) throw err;
    mqttClient.on('message', async (topic, weather) => {
        if (!weather) {
            console.error('Aucune donnée n\'a été récupéré');
            return;
        }
        const weatherJson = JSON.parse(weather.toString());
        weatherDataClient.insert(weatherJson).catch(() => {
            console.error('Impossible d\'insérer dans la base');
        });
    });
});

//API

app.get('/cities', async (req, res) => {
    weatherDataClient.getDataForPeriod(parseInt(req.query.startTime, 10), parseInt(req.query.endTime, 10)).then((result) => {
        res.send(result);
    }).catch(() => {
        res.status(500).send('No data found!');
    });
});

app.get('/city', async (req, res) => {
    weatherDataClient.getCityDataForPeriod(parseInt(req.query.startTime, 10), parseInt(req.query.endTime, 10), req.query.cityName).then((result) => {
        res.send(result);
    }).catch(() => {
        res.status(500).send('No data found!');
    });
});

app.get('/cities/now', async (req, res) => {
    weatherDataClient.getCurrentData().then((result) => {
        res.send(result);
    }).catch(() => {
        res.status(500).send('No data found!');
    });
});
