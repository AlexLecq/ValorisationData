require("dotenv").config();
const mqtt = require("mqtt");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WeatherDataAccess = require("./dal/WeatherDataAccess");
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
    "un problème est survenue lors de la connexion au serveur MQTT : " + e
  );
}

app.use(express.json());
app.use(express.static("public"));
app.listen(process.env.PORT);

mqttClient.on("connect", () => {
  console.log("Connection serveur MQTT => OK");
});

mqttClient.subscribe(process.env.MQTT_TOPIC, (err) => {
  if (err) throw err;
  mqttClient.on("message", (topic, weather) => {
    // message is Buffer
    if (!weather) {
      console.error("Aucune donnée n'a été récupéré");
      return;
    }
    const weatherJson = JSON.parse(weather.toString());
    console.dir(weatherJson);
    weatherDataClient.insert(weatherJson);
  });
});

app.get("/cities", async (req, res) => {
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  res.send(await weatherDataClient.getDataForPeriod(startTime, endTime));
});

app.get("/city", async (req, res) => {
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  const cityName = req.query.cityName;
  res.send(
    await weatherDataClient.getCityDataForPeriod(startTime, endTime, cityName)
  );
});
