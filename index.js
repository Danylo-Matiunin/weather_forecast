"use strict";

const weatherBlock = document.querySelector('#weather-block');
const forecastBlock = document.querySelector('#weather-forecast-for-days');

async function loadWeatherAndForecast() {
    weatherBlock.innerHTML = `<div class="weather__loading">
    <img src="img/loading.gif" alt="Loading...">
    </div>`;
    forecastBlock.innerHTML = `<div class="weather__loading">
    <img src="img/loading.gif" alt="Loading...">
    </div>`;

    const currentWeatherServer = 'https://api.openweathermap.org/data/2.5/weather?q=Lviv&appid=fef5c86fd22da009f4997db06d856f17';
    const forecastServer = 'https://api.openweathermap.org/data/2.5/forecast?q=Lviv&appid=fef5c86fd22da009f4997db06d856f17';

    const currentWeatherResponse = await fetch(currentWeatherServer);
    const currentWeatherResponseResult = await currentWeatherResponse.json();

    if (currentWeatherResponse.ok) {
        getWeather(currentWeatherResponseResult);
    } else {
        weatherBlock.innerHTML = currentWeatherResponseResult.message;
    }

    const forecastResponse = await fetch(forecastServer);
    const forecastResponseResult = await forecastResponse.json();

    if (forecastResponse.ok) {
        displayWeatherForecast(forecastResponseResult);
    } else {
        forecastBlock.innerHTML = forecastResponseResult.message;
    }
}

function getWeather(data) {
    console.log(data);

    const location = data.name;
    const temp = Math.round(data.main.temp);
    const feelslike = Math.round(data.main.feels_like);
    const weatherStatus = data.weather[0].main;
    const weatherIcon = data.weather[0].icon;

    let tempC = Math.round(temp - 273.15);
    let feelslikeC = Math.round(feelslike - 273.15);

    const template =
    `<div class="main-template">
    <div class="location" id="city">${location}</div>
    <img class="icon" src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherStatus}">
  </div>
    <div class="weather" id="weather-forecast">${weatherStatus}</div>
    <div class="temprature">${tempC}°C</div>
    <div class="feels-like">Feels like</br>${feelslikeC}°C</div>`

    weatherBlock.innerHTML = template;
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

    forecastBlock.innerHTML = template;
}

function convertKelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

function getDayOfWeekForecast(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
}

loadWeatherAndForecast();
