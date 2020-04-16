const mymap = L.map('mapid').setView([48.85, 2.35], 6);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxleGxlY3EiLCJhIjoiY2s4enhrajdqMDBjMjNlcXZqZzYzb3YzbyJ9.b7mcgopV5pSE4zTsqzVtOQ'
}).addTo(mymap);

fetch('/cities/now', {
    method: 'GET',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(async (response) => {
    const json = await response.json();
    for (const city of json[0].cities) {
        const colorValues = getColorFromHumidity(city.humidity);
        const circle = L.circle([city.lat, city.long], {
            color: colorValues.colorText,
            fillColor: colorValues.colorHex,
            fillOpacity: 0.5,
            radius: city.humidity * 400
        }).addTo(mymap);
        const htmlCircle = circle.getPane();
        circle.on('click', (e) => {
            $('#modalTitle').html(`<strong>${city.name}</strong>`);
            $('#actualData').html(`
                    <h4 class="display-6">Informations actuelles</h4>
                    Température: ${city.temp} °C
                    </br>
                    Pression: ${city.pressure} hPa
                    </br>
                    Taux d'humidité: ${city.humidity} %
               `);
            createCharts(city.name);
            $('#exampleModalCenter').modal('toggle');
        });
        circle.on('mouseover', (e) => {
            circle.options.radius += 1000;
            htmlCircle.style.opacity = 0.8;
        });
        circle.on('mouseout', (e) => {
            circle.options.radius -= 1000;
            htmlCircle.style.opacity = 1;
        });
    }
}).catch((err) => {
    console.error(err);
});

function getColorFromHumidity(humidity) {
    if (!humidity) {
        console.error('Aucun taux d\'humidité');
        return;
    }

    if (humidity < 61)
        return {colorText: 'red', colorHex: '#ff0000'};
    else if (humidity >= 61 && humidity < 75)
        return {colorText: 'purple', colorHex: '#660066'};
    else if (humidity >= 75)
        return {colorText: 'blue', colorHex: '#0052cc'};
}