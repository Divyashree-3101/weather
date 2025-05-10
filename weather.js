const apiKey = 'e177466e572d4138bb208c558e2a654b'; 
const getWeatherButton = document.getElementById('getWeather');
const getLocationWeatherButton = document.getElementById('getLocationWeather');
const weatherInfoDiv = document.getElementById('weatherInfo');
const forecastDiv = document.getElementById('forecast');
const toggleThemeButton = document.getElementById('toggleTheme');
const body = document.body;

getWeatherButton.addEventListener('click', getWeather);
getLocationWeatherButton.addEventListener('click', getCurrentLocationWeather);
toggleThemeButton.addEventListener('click', toggleTheme);

function toggleTheme() {
    body.classList.toggle('dark');
}

async function getWeather() {
    const city = document.getElementById('city').value;

    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            alert('City not found');
            return;
        }

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
    } catch (error) {
        alert('Error fetching data. Please try again later.');
        console.error(error);
    }
}

async function getCurrentLocationWeather() {
    document.getElementById('city').value='';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
                const weatherData = await weatherResponse.json();

                const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
                const forecastData = await forecastResponse.json();

                displayCurrentWeather(weatherData);
                displayForecast(forecastData);
            } catch (error) {
                alert('Error fetching data. Please try again later.');
                console.error(error);
            }
        }, () => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function displayCurrentWeather(data) {
    const { name, main, wind } = data;
    weatherInfoDiv.innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Pressure: ${main.pressure} hPa</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <p>UV Index: N/A</p>
    `;
}

function displayForecast(data) {
    forecastDiv.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const { dt, main, wind } = data.list[i];
        const date = new Date(dt * 1000).toLocaleDateString();
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <span>${date}</span>
            <span>Temp: ${main.temp} °C</span>
            <span>Wind: ${wind.speed} m/s</span>
        `;
        forecastDiv.appendChild(forecastItem);
    }
}