document.addEventListener('DOMContentLoaded', function () {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');
    const weatherCard = document.getElementById('weather-card');
    const initialMessage = document.getElementById('initial-message');

    const cityName = document.getElementById('city-name');
    const date = document.getElementById('date');
    const temperature = document.getElementById('temperature');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherDescription = document.getElementById('weather-description');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const pressure = document.getElementById('pressure');

    searchButton.addEventListener('click', getWeatherData);
    cityInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            getWeatherData();
        }
    });

    function getWeatherData() {
        const city = cityInput.value.trim();
        if (!city) {
            showError('Please enter a city name');
            return;
        }

        errorMessage.style.display = 'none';
        weatherCard.style.display = 'none';
        initialMessage.style.display = 'none';
        loading.style.display = 'block';

        fetch(`https://wttr.in/${city}?format=j1`)
            .then(response => {
                if (!response.ok) throw new Error('City not found');
                return response.json();
            })
            .then(data => {
                displayWeatherData(city, data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                showError('City not found. Please check the spelling and try again.');
            });
    }

    function displayWeatherData(city, data) {
        loading.style.display = 'none';

        const current = data.current_condition[0];
        const condition = current.weatherDesc[0].value.toLowerCase();

        cityName.textContent = city;
        const currentDate = new Date();
        date.textContent = formatDate(currentDate);

        temperature.textContent = `${current.temp_C}°C`;

        const iconClassMap = {
            'sunny': 'wi-day-sunny',
            'clear': 'wi-day-sunny',
            'cloudy': 'wi-cloudy',
            'partly cloudy': 'wi-day-cloudy',
            'overcast': 'wi-cloudy',
            'light rain': 'wi-showers',
            'moderate rain': 'wi-rain',
            'heavy rain': 'wi-rain-wind',
            'snow': 'wi-snow',
            'mist': 'wi-fog',
            'thunderstorm': 'wi-thunderstorm'
        };

        const iconClass = iconClassMap[condition] || 'wi-na';
        weatherIcon.className = `wi weather-icon ${iconClass}`;
        weatherIcon.title = current.weatherDesc[0].value;

        weatherDescription.textContent = current.weatherDesc[0].value;
        feelsLike.textContent = `${current.FeelsLikeC}°C`;
        humidity.textContent = `${current.humidity}%`;
        windSpeed.textContent = `${current.windspeedKmph} km/h`;
        pressure.textContent = `${current.pressure} hPa`;

        weatherCard.style.display = 'block';
    }



    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function showError(message) {
        loading.style.display = 'none';
        weatherCard.style.display = 'none';
        initialMessage.style.display = 'none';
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }


});