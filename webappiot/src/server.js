require('dotenv').config();
const mqtt = require('mqtt');
const express = require('express');
const app = express();
const WeatherDataAccess = require('./dal/WeatherDataAccess');
const weatherDataClient = new WeatherDataAccess(
    {
        url:process.env.MONGODB_URL,
        db: process.env.MONGODB_DB,
        col: process.env.MONGODB_COL
    });
let client;
try{
    client = mqtt.connect(process.env.MQTT_URL);
}catch (e) {
    console.error('un problème est survenue lors de la connexion au serveur MQTT : '+ e);
}

app.use(express.json());
app.use(express.static('public'));
app.listen(process.env.PORT);

client.on('connect', ()=>{
   console.log('Connection serveur MQTT => OK');
});

client.subscribe(process.env.MQTT_TOPIC, (err) => {
    if(err) throw err;
    client.on('message', (topic, weather) => {
        // message is Buffer
        if(!weather){
            console.error('Aucune donnée n\'a été récupéré');
            return;
        }
        const weatherJson = JSON.parse(weather.toString());
        console.dir(weatherJson);
        weatherDataClient.insert(weatherJson);
    });
});

