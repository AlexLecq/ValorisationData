import paho.mqtt.client as mqtt
import time
import json
from urllib.request import urlopen

WEATHER_TOPIC = 'meteoiot'

CITIES = ['Paris', 'Marseille', 'Lyon', 'Bordeaux', 'Nantes', 'Toulouse', 'Strasbourg', 'Nice', 'Lille', 'Montpellier']


def get_data(city):
    in_data = json.load(urlopen(f'http://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid=19053ef85ef1b948847c41a7b78585bc'))
    return {
        'name': city,
        'long': in_data['coord']['lon'],
        'lat': in_data['coord']['lat'],
        'temp': in_data['main']['temp'],
        'pressure': in_data['main']['pressure'],
        'humidity': in_data['main']['humidity']
    }


def get_all_data():
    all_data = []
    for city in CITIES:
        all_data.append(get_data(city))
    return json.dumps({'cities': all_data})


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        client.connection_state = True


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
