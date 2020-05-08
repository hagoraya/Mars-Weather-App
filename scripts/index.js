const API_KEY = 'UawFNwGgxNMVcGSi4rWxCp5c6eHJ7p9jfc5h2ow4'
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`

const previousWeatherToggle = document.querySelector('.show-previous-weather');

const previousWeather = document.querySelector('.previous-weather');

previousWeatherToggle.addEventListener('click', () => {
    previousWeather.classList.toggle('show-weather')
})


const currentSolElement = document.querySelector('[data-current-sol]')
const currentDateElement = document.querySelector('[data-current-date]')
const currentHighTempElement = document.querySelector('[current-tempHigh]')
const currentLowTempElement = document.querySelector('[current-tempLow]')
const currentWindElement = document.querySelector('[data-wind-speed]')
const currentWindDirectionText = document.querySelector('[data-wind-direction-text]')
const currentWindDirectionArrow = document.querySelector('[data-wind-direction-arrow]')


const previousSolTemplate = document.querySelector('[data-previous-sol-template]')
const previousSolContainer = document.querySelector('[data-previous-sols]')


const unitToggle = document.querySelector('[data-unit-toggle]')
const metricRadio = document.getElementById('cel')
const imperialRadio = document.getElementById('fah')




let selectedSolIndex

getWeather().then(sols => {
    selectedSolIndex = sols.length - 1 //Default last sol
    displaySelectedSol(sols);
    displayPreviousSols(sols)
    updateUnits()

    unitToggle.addEventListener('click', () => {
        let meticUnits = !isMetric()
        metricRadio.checked = meticUnits
        imperialRadio.checked = !meticUnits
        displaySelectedSol(sols);
        displayPreviousSols(sols)
        updateUnits()
    })

    metricRadio.addEventListener('change', () => {
        displaySelectedSol(sols);
        displayPreviousSols(sols)
        updateUnits()
    })

    imperialRadio.addEventListener('change', () => {
        displaySelectedSol(sols);
        displayPreviousSols(sols)
        updateUnits();
    })
})


function updateUnits() {
    const speedUnits = document.querySelectorAll('[data-wind-unit]')
    const tempUnits = document.querySelectorAll('[data-temp-unit]')
    speedUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'kph' : 'mph'
    })

    tempUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'C' : 'F'
    })

}


function isMetric() {
    return metricRadio.checked
}


function displayDate(date) {
    return date.toLocaleString(
        undefined,
        { day: 'numeric', month: 'long' }
    )

}


function displayTemperature(temp) {
    let returnTemp = temp;

    if (!isMetric()) {
        returnTemp = (temp - 32) * (5 / 9)
    }
    return Math.round(returnTemp)
}

function displayWindSpeed(wind) {
    let tempWind = wind

    if (!isMetric()) {
        tempWind = tempWind / 1.609
    }
    return Math.round(tempWind)
}


function displayPreviousSols(sols) {
    previousSolContainer.innerHTML = ''
    sols.forEach((solData, index) => {
        const solContainer = previousSolTemplate.content.cloneNode(true)
        solContainer.querySelector('[data-sol').innerText = solData.sol
        solContainer.querySelector('[data-date]').innerText = displayDate(solData.date)
        solContainer.querySelector('[data-temp-high]').innerText = displayTemperature(solData.maxTemp)
        solContainer.querySelector('[data-temp-low]').innerText = displayTemperature(solData.minTemp)
        solContainer.querySelector('[data-select-button]').addEventListener('click', () => {
            selectedSolIndex = index
            displaySelectedSol(sols)
        })
        previousSolContainer.appendChild(solContainer)
    })
}


function displaySelectedSol(sols) {
    const selectedSol = sols[selectedSolIndex];
    currentSolElement.innerText = selectedSol.sol
    currentHighTempElement.innerText = displayTemperature(selectedSol.maxTemp)
    currentLowTempElement.innerText = displayTemperature(selectedSol.minTemp)
    currentWindElement.innerText = displayWindSpeed(selectedSol.windSpeed)
    currentWindDirectionText.innerText = selectedSol.windDirectionCardinal
    currentWindDirectionArrow.style.setProperty('--direction', `${selectedSol.windDirectionDegrees}deg`)
    currentDateElement.innerText = displayDate(selectedSol.date)

    console.log(selectedSol);
}

function getWeather() {
    return fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const {
                sol_keys,
                validity_checks,
                ...solData
            } = data

            return Object.entries(solData).map(([sol, data]) => {
                return {
                    sol: sol,
                    maxTemp: data.AT.mx,
                    minTemp: data.AT.mn,
                    windSpeed: data.HWS.av,
                    windDirectionDegrees: data.WD.most_common.compass_degrees,
                    windDirectionCardinal: data.WD.most_common.compass_point,
                    date: new Date(data.First_UTC),
                }

            })

            c

        })
}