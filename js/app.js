const apiKey = "27517e493705b5514fd6eeff8c42c268";

// Simulating my current location using fixed coordinates (Lucknow)
function getUserLocation() {
    return {
        latitude: 26.850000,
        longitude: 80.949997
    };
}

// Fetch weather info based on latitude and longitude (used for simulated location)
async function fetchWeatherByCoordinates(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Geo Weather Data:", data);

        document.getElementById("city-name").innerText = `📍 ${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").innerText = `🌡️ ${data.main.temp}°C`;
        document.getElementById("weather-description").innerText = `☁️ ${data.weather[0].description}`;

        document.querySelector(".weather-info").style.display = "block";
        changeBackground(data.weather[0].main.toLowerCase());

        // Reusing city name to get forecast data
        fetchForecastData(data.name);
    } catch (error) {
        console.error("Error fetching geolocation weather:", error);
        alert("Couldn't fetch weather for your simulated location.");
    }
}

// Function to fetch current weather data based on city input
async function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("City not found! Please enter a valid city.");
        }
        const data = await response.json();
        console.log("Weather data:", data);

        // Update the DOM with current weather info
        document.getElementById("city-name").innerText = `📍 ${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").innerText = `🌡️ ${data.main.temp}°C`;
        document.getElementById("weather-description").innerText = `☁️ ${data.weather[0].description}`;

        // Show weather info box
        document.querySelector(".weather-info").style.display = "block";



        // Fetch 3-day forecast for the city
        fetchForecastData(city);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert(error.message);
    }
}

// Function to fetch forecast data (3-day)
async function fetchForecastData(city) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const forecastResponse = await fetch(forecastApiUrl);
        if (!forecastResponse.ok) {
            throw new Error("Forecast data not found!");
        }
        const forecastData = await forecastResponse.json();
        console.log("Forecast data:", forecastData);

        // Process and display forecast
        processForecastData(forecastData);

    } catch (error) {
        console.error("Error fetching forecast data:", error);
        alert(error.message);
    }
}

// Display forecast cards dynamically for next 3 days
function processForecastData(forecastData) {
    const forecastDaysContainer = document.querySelector(".forecast-days");
    forecastDaysContainer.innerHTML = "";  // Clear old data

    // Get forecast for 12:00 PM only (to make it clean and consistent)
    const filteredData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    // Limit to first 3 days
    const threeDayForecast = filteredData.slice(0, 3);

    threeDayForecast.forEach(day => {
        const date = new Date(day.dt_txt).toDateString();
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        const temp = `${day.main.temp}°C`;
        const description = day.weather[0].description;

        const dayCard = document.createElement("div");
        dayCard.classList.add("day-card");

        dayCard.innerHTML = `
            <div class="day-date">${date}</div>
            <div class="day-weather-icon"><img src="${icon}" alt="Weather Icon"></div>
            <div class="day-temperature">${temp}</div>
            <div class="day-description">${description}</div>
        `;

        forecastDaysContainer.appendChild(dayCard);
    });
}

//  When user enters a city name manually and clicks search
document.getElementById("search-btn").addEventListener("click", function () {
    const city = document.getElementById("city-input").value.trim();
    if (city === "") {
        alert("Please enter a city name.");
        return;
    }
    fetchWeatherData(city);
});

//  Handle "My Location" button click
const geoBtn = document.getElementById("geo-btn");
if (geoBtn) {
    geoBtn.addEventListener("click", function () {
        const location = getUserLocation();
        fetchWeatherByCoordinates(location.latitude, location.longitude);
    });
}
