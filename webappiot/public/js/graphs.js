const calculateVariance = function (data, ville, attribut) {
     // vérification des données
     if (typeof data == 'undefined') {
          console.error("Erreur données api meteo nul");
          return null;
     } else if (typeof data[0].cities == 'undefined') {
          console.error("Erreur données pour la ville vide");
          return null;
     } else if (typeof data[0].cities.find(element => element.name === ville) == 'undefined') {
          console.error("Erreur attribut pour la ville nul");
          return null;
     }
     var dataVille = data[0].cities.find(element => element.name === ville)
     if (typeof dataVille[attribut] == 'undefined') {
          console.error("Erreur attribut pour la ville nul");
          return null;
     }
     // algo pour construire le résultat
     var result = [];
     var lastData;
     data.forEach(element => {
          const found = element.cities.find(element => element.name === ville);
          var attributTour = found[attribut];
          if (typeof lastData == 'undefined') lastData = attributTour;
          result.push(attributTour - lastData);
          lastData = attributTour;
     });
     return result;
}

const buildLabel = function (data) {
     // vérification des données
     if (typeof data == 'undefined') {
          console.error("Erreur données api meteo nul");
          return null;
     } else if (typeof data[0].date == 'undefined') {
          console.error("Erreur données pour la ville vide");
          return null;
     }
     // algo pour construire le résultat
     var result = [];
     data.forEach(element => {
          result.push((new Date(element.date)).toLocaleDateString('en-GB', {
               hour: 'numeric',
               minute: 'numeric',
               second: 'numeric',
               day: 'numeric',
               month: 'short',
               year: 'numeric'
          }));
     });
     return result;
}

const createLabelColor = function (data, color) {
     if (typeof color == 'undefined') color = 'red';
     result = [];
     for (var i = 0; data.length > i; ++i) {
          result.push(color);
     }
     return result;
}

const createGraphs = () => {
     requirejs(["node_modules/chart.js/dist/Chart.min.js"], function (a) {
          var heatCanvas = document.getElementById('heat').getContext('2d');
          var humidityCanvas = document.getElementById('humidity').getContext('2d');
          var pressureCanvas = document.getElementById('pressure').getContext('2d');
          var focusedCity = $('#modalTitle').html(); // TODO A REMPLACER PAR LA VILLE VOULU
          // ajax pour les requêtes
          fetch(url_server + '/city', {
               method: 'GET',
               mode: 'cors',
               headers: {
                    'Content-Type': 'application/json',
                    startTime: 0,
                    endTime: Date.now(),
                    cityName: focusedCity
               }
          }).then(response => response.json())
               .then(data => {
                    drawCharts(JSON.stringify(data));
                    $('.containCityName').each(function () {
                         this.textContent = this.textContent.replace('##CITYNAME##', focusedCity);
                    });
                    var labelsdata = buildLabel(data);
                    var dataCleanedHeat = calculateVariance(data, focusedCity, 'temp');
                    var dataCleanedHumid = calculateVariance(data, focusedCity, 'humidity');
                    var dataCleanedPress = calculateVariance(data, focusedCity, 'pressure');
                    // mise en place des charts
                    var heatData = {
                         type: 'bar',
                         data: {
                              labels: labelsdata,
                              datasets: [{
                                   label: 'Variation de température',
                                   data: dataCleanedHeat,
                                   backgroundColor: createLabelColor(dataCleanedHeat, "#FF660044"),
                                   borderColor: createLabelColor(dataCleanedHeat, "#AA3322"),
                                   borderWidth: 1
                              }]
                         },
                         options: {
                              aspectRatio: 4,
                              scales: {
                                   yAxes: [{
                                        ticks: {
                                             beginAtZero: true
                                        }
                                   }]
                              }
                         }
                    };
                    var humidityData = {
                         type: 'bar',
                         data: {
                              labels: labelsdata,
                              datasets: [{
                                   label: 'Variation de température',
                                   data: dataCleanedHumid,
                                   backgroundColor: createLabelColor(dataCleanedHumid, "#0033FF44"),
                                   borderColor: createLabelColor(dataCleanedHumid, "#0033AA"),
                                   borderWidth: 1
                              }]
                         },
                         options: {
                              aspectRatio: 4,
                              scales: {
                                   yAxes: [{
                                        ticks: {
                                             beginAtZero: true
                                        }
                                   }]
                              }
                         }
                    };
                    var pressureData = {
                         type: 'bar',
                         data: {
                              labels: labelsdata,
                              datasets: [{
                                   label: 'Variation de pression',
                                   data: dataCleanedPress,
                                   backgroundColor: createLabelColor(dataCleanedPress, "#00AAAA44"),
                                   borderColor: createLabelColor(dataCleanedPress, "#005555"),
                                   borderWidth: 1
                              }]
                         },
                         options: {
                              aspectRatio: 4,
                              scales: {
                                   yAxes: [{
                                        ticks: {
                                             beginAtZero: true
                                        }
                                   }]
                              }
                         }
                    };
                    var heatChart = new Chart(heatCanvas, heatData);
                    var humidityChart = new Chart(humidityCanvas, humidityData);
                    var pressureChart = new Chart(pressureCanvas, pressureData);
               })
               .catch((err) => {
                    console.error(err);
               });
     });
}
