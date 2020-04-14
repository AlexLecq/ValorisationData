import paho.mqtt.client as mqtt
import time
import json
from urllib.request import urlopen

WEATHER_TOPIC = "meteoiot"


def get_data():
    in_data = json.load(urlopen("http://api.openweathermap.org/data/2.5/weather?q=Arras&units=metric&appid=19053ef85ef1b948847c41a7b78585bc"))
    out_data = {
        'temp': in_data['main']['temp'],
        'pressure': in_data['main']['pressure'],
        'humidity': in_data['main']['humidity']
    }
    return json.dumps(out_data)


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        client.connection_state = True
        print("Connected")
    else:
        print("Bad connection Returned code=", rc)


broker = "broker.mqttdashboard.com"
client = mqtt.Client()
client.connection_state = False
client.on_connect = on_connect
client.loop_start()
print("Connecting to broker:", broker)
client.connect(broker)

while not client.connection_state:
    time.sleep(1)

client.publish(WEATHER_TOPIC, get_data(), 0, True)
client.loop_stop()
client.disconnect()



