const heatCanvas = document.getElementById('heat').getContext('2d');
const humidityCanvas = document.getElementById('humidity').getContext('2d');
const pressureCanvas = document.getElementById('pressure').getContext('2d');

/***
 * Create all the graphs to display
 * @param focusedCity
 */
function createGraphs(focusedCity) {
    fetch(`/city?startTime=${0}&endTime=${Date.now()}&cityName=${focusedCity}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(async (response) => {
        const json = await response.json();
        drawCharts(json, focusedCity);
    }).catch((err) => {
        console.error(err);
    });
}


function drawCharts(data, focusedCity) {
    $('.containCityName').each(function () {
        this.textContent = this.textContent.replace('##CITYNAME##', focusedCity);
    });
    const labelsdata = buildLabel(data);
    const dataCleanedHeat = computeVariation(data, focusedCity, 'temp');
    const dataCleanedHumid = computeVariation(data, focusedCity, 'humidity');
    const dataCleanedPress = computeVariation(data, focusedCity, 'pressure');
    console.log(dataCleanedPress);

    // mise en place des charts
    const heatData = {
        type: 'bar',
        data: {
            labels: labelsdata,
            datasets: [{
                label: 'variation de température',
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
    const humidityData = {
        type: 'bar',
        data: {
            labels: labelsdata,
            datasets: [{
                label: 'variation de température',
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
    const pressureData = {
        type: 'bar',
        data: {
            labels: labelsdata,
            datasets: [{
                label: 'variation de pression',
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

    const heatChart = new Chart(heatCanvas, heatData);
    const humidityChart = new Chart(humidityCanvas, humidityData);
    const pressureChart = new Chart(pressureCanvas, pressureData);
}

/***
 * Compute the variation over time for the selected attribut
 * @param allData
 * @param cityName
 * @param attribut
 * @returns {null|[]}
 */
function computeVariation(allData, cityName, attribut) {
    if (!allData) return null;

    let variations = [];
    let previousData = null;

    for (const oneData of allData) {
        if (!oneData.city) continue;
        const cityData = oneData.city;
        let currentData = cityData[attribut];
        if (previousData)
            variations.push(currentData - previousData);
        previousData = currentData;
    }
    return variations;
}

/**
 * Build labels with time datas
 * @param allData
 * @returns {null|[]}
 */
function buildLabel(allData) {
    if (!allData) return null;

    let labels = [];
    for (const oneData of allData) {
        labels.push((new Date(oneData.date)).toLocaleDateString('fr-FR', {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'short',
        }));
    }
    return labels;
}

/***
 *
 * @param data
 * @param color
 * @returns {[]}
 */
function createLabelColor(data, color) {
    if (!color) color = 'red';
    let result = [];
    for (let i = 0; data.length > i; ++i)
        result.push(color);
    return result;
}


