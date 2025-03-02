const apiKey = "27517e493705b5514fd6eeff8c42c268";

// Function to fetch weather data
async function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("City not found! Please enter a valid city.");
        }
        const data = await response.json();
        console.log("Weather data:", data);

        // Updating the DOM with weather information
        document.getElementById("city-name").innerText = `📍 ${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").innerText = `🌡️ ${data.main.temp}°C`;
        document.getElementById("weather-description").innerText = `☁️ ${data.weather[0].description}`;

        // Show weather info box
        document.querySelector(".weather-info").style.display = "block";
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert(error.message);
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
