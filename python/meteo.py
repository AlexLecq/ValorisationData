import paho.mqtt.client as mqtt
import time
import json
from urllib.request import urlopen
from python.City import City

WEATHER_TOPIC = 'meteoiot'

CITIES = [
    City('Paris', '19053ef85ef1b948847c41a7b78585bc'),
    City('Marseille', '22a85a0e711e34359c1647f0c82aedf0'),
    City('Lyon', 'd82c7c91c484f775d8118b58199bdd21'),
    City('Bordeaux', '94a63ea8c259c120cb59ad04f804d2a6'),
    City('Nantes', '29dac037018e9a651c9fc2a0bc82c43e'),
    City('Toulouse', '209f5592784e87a6ae5095095e1af97f'),
    City('Strasbourg', 'bf5ebbcb48b6b3331038514d5fa8a16c'),
    City('Nice', '2c7745c0338a71a9fca3874a2ef7a340'),
    City('Lille', '8cd1b9d8283e5052a664ae1378257363'),
    City('Montpellier', 'da8cc5dac3a3e21ab337743d2a9765ef')
]


def get_data(city_data):
    in_data = json.load(urlopen(f'http://api.openweathermap.org/data/2.5/weather?q={city_data.name}&units=metric&appid={city_data.api_key}'))
    return {
        'name': city_data.name,
        'long': in_data['coord']['lon'],
        'lat': in_data['coord']['lat'],
        'temp': in_data['main']['temp'],
        'pressure': in_data['main']['pressure'],
        'humidity': in_data['main']['humidity']
    }


def get_all_data():
    all_data = []
    for city_data in CITIES:
        all_data.append(get_data(city_data))
    return json.dumps({'cities': all_data})


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        client.connection_state = True
        print('Connected')
    else:
        print('Bad connection Returned code=', rc)


broker = 'broker.mqttdashboard.com'
client = mqtt.Client()
client.connection_state = False
client.on_connect = on_connect
client.loop_start()
client.connect(broker)

while not client.connection_state:
    time.sleep(1)

client.publish(WEATHER_TOPIC, get_all_data(), 0, False)
client.loop_stop()
client.disconnect()
