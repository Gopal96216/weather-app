const apiKey = "27517e493705b5514fd6eeff8c42c268";

// Function to fetch current weather data
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

        // Get weather condition & change theme
        const weatherCondition = data.weather[0].main.toLowerCase();
        changeBackground(weatherCondition);

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

// Function to process and display 3-day forecast
function processForecastData(forecastData) {
    const forecastDaysContainer = document.querySelector(".forecast-days");
    forecastDaysContainer.innerHTML = "";  // Clear old data

    // Filter data for 12:00 PM forecasts
    const filteredData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    // Get only the first 3 days
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

// Function to change background based on weather
function changeBackground(condition) {
    let backgroundGradient = "";

    if (condition.includes("clear")) {
        backgroundGradient = "linear-gradient(135deg, #f6d365 0%, #fda085 100%)"; // Sunny
    } else if (condition.includes("cloud")) {
        backgroundGradient = "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)"; // Cloudy
    } else if (condition.includes("rain")) {
        backgroundGradient = "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)"; // Rainy
    } else if (condition.includes("mist") || condition.includes("haze")) {
        backgroundGradient = "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)"; // Misty
    } else if (condition.includes("snow")) {
        backgroundGradient = "linear-gradient(135deg, #e0eafc 0%, #fdfbfb 100%)"; // Snow
    } else {
        backgroundGradient = "linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)"; // Default
    }

    document.body.style.background = backgroundGradient;
    document.body.style.transition = "background 1s ease-in-out";
    function changeBackground(condition) {
        let backgroundGradient = "";
    
        // Reset all effects first
        document.querySelector(".clouds").style.display = "none";
        document.querySelector(".rain").style.display = "none";
        document.querySelector(".snow").style.display = "none";
    
        if (condition.includes("clear")) {
            backgroundGradient = "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
            // Clear = No special effects
        } else if (condition.includes("cloud")) {
            backgroundGradient = "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)";
            document.querySelector(".clouds").style.display = "block"; // Clouds move
        } else if (condition.includes("rain")) {
            backgroundGradient = "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)";
            document.querySelector(".rain").style.display = "block"; // Rain falls
        } else if (condition.includes("mist") || condition.includes("haze")) {
            backgroundGradient = "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)";
            // No special effect, but can add fog later
        } else if (condition.includes("snow")) {
            backgroundGradient = "linear-gradient(135deg, #e0eafc 0%, #fdfbfb 100%)";
            document.querySelector(".snow").style.display = "block"; // Snow falls
        } else {
            backgroundGradient = "linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)";
        }
    
        document.body.style.background = backgroundGradient;
        document.body.style.transition = "background 1s ease-in-out";
    }
    
}

// Event listener for search button
document.getElementById("search-btn").addEventListener("click", function() {
    const city = document.getElementById("city-input").value.trim();
    if (city === "") {
        alert("Please enter a city name.");
        return;
    }
    fetchWeatherData(city);
});
