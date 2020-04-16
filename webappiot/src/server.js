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
     console.error(
          'un problème est survenue lors de la connexion au serveur MQTT : ' + e
     );
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
          console.table(weatherJson);
          if (!await weatherDataClient.insert(weatherJson))
               console.log('Impossible d\'insérer dans la base');
     });
});

app.get('/cities', async (req, res) => {
     const startTime = req.query.startTime;
     const endTime = req.query.endTime;
     const data = await weatherDataClient.getDataForPeriod(startTime, endTime);
     if (data) res.send(data);
     else res.status(500).send('No data found!');
});

app.get('/city', async (req, res) => {
     const startTime = req.query.startTime;
     const endTime = req.query.endTime;
     const cityName = req.query.cityName;
     const data = await weatherDataClient.getCityDataForPeriod(
          startTime,
          endTime,
          cityName
     );
     if (data) res.send(data);
     else res.status(500).send('No data found!');
});

app.get('/cities/now', async (req, res) => {
     const data = await weatherDataClient.getCurrentData();
     if (data) res.send(data);
     else res.status(500).send('No data found!');
});

async function f() {
     try {
          const a = await weatherDataClient.getCityDataForPeriod(0, Date.now(), 'Paris');
          console.log(a);
     } catch (e) {
          console.error(e);
     }
}

//f();