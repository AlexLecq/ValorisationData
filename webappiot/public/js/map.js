const mymap = L.map('mapid').setView([48.85, 2.35], 6);
const url_server = 'http://localhost:3000';
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution:
		'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox/streets-v11',
	tileSize: 512,
	zoomOffset: -1,
	accessToken: 'pk.eyJ1IjoiYWxleGxlY3EiLCJhIjoiY2s4enhrajdqMDBjMjNlcXZqZzYzb3YzbyJ9.b7mcgopV5pSE4zTsqzVtOQ'
}).addTo(mymap);

try {
	let response = await fetch(url_server + '/cities/now', {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const json = await response.json();
	console.dir(json);
	for (const city of json.cities) {
		L.circle([city.lat, city.long], {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5,
			radius: 50000
		}).addTo(mymap);
		L.marker([city.lat, city.long]).addTo(mymap).bindPopup('Magnifique popup<br> Easily customizable.');
	}
} catch (err) {
	console.error(err);
}


L.marker([48.85, 2.35]).addTo(mymap).bindPopup('Magnifique popup<br> Easily customizable.');