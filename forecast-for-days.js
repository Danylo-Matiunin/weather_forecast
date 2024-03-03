"use strict";

const weatherBlock = document.querySelector('#weather-forecast-for-days');

async function loadWeatherForecast() {
    weatherBlock.innerHTML = `<div class="weather__loading">
    <img src="img/loading.gif" alt="Loading...">
    </div>`;

    const server = 'https://api.openweathermap.org/data/2.5/forecast?q=Lviv&appid=fef5c86fd22da009f4997db06d856f17';
    const response = await fetch(server, {
        method: 'GET',
    });
    const responseResult = await response.json();

    if (response.ok) {
        displayWeatherForecast(responseResult);
    } else {
        weatherBlock.innerHTML = responseResult.message;
    }
}

function displayWeatherForecast(data) {
    const days = {};

    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!days[date]) {
            days[date] = {
                date: date,
                minTemp: Infinity,
                maxTemp: -Infinity,
                weatherIcon: item.weather[0].icon,
                weatherStatus: item.weather[0].description
            };
        }

        const temp = item.main.temp;
        if (temp < days[date].minTemp) {
            days[date].minTemp = temp;
        }
        if (temp > days[date].maxTemp) {
            days[date].maxTemp = temp;
        }
    });

    let template = '';
    Object.values(days).forEach(day => {
        template += `
            <div class="day-1__forecast">
                <div class="name-of__day">${getDayOfWeekForecast(day.date)}</div>
                <img class="day-icon" src="https://openweathermap.org/img/wn/${day.weatherIcon}.png" alt="${day.weatherStatus}">
                <div class="day-temperature__min">${convertKelvinToCelsius(day.minTemp)}°C</div>
                <div class="day-temperature__max">${convertKelvinToCelsius(day.maxTemp)}°C</div>
            </div>
            <hr>
        `;
    });

    weatherBlock.innerHTML = template;
}

function convertKelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

function getDayOfWeekForecast(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
}

if (weatherBlock) {
    loadWeatherForecast();
}
