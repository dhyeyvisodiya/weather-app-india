const apiKey = "7dabe1eadab5c7a03484b5617a668200"; // Replace with your OpenWeatherMap API key

async function getWeather() {
  const city = document.getElementById("citySelect").value;
  const resultDiv = document.getElementById("weatherResult");

  if (!city) {
    resultDiv.innerHTML = "<p>Please select a city.</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    // Current (first forecast block)
    const current = data.list[0];
    const cityName = data.city.name;
    const country = data.city.country;
    const temp = current.main.temp;
    const humidity = current.main.humidity;
    const description = current.weather[0].description;
    const rainChance = current.pop !== undefined ? (current.pop * 100).toFixed(0) : 0;

    let html = `
      <h3>${cityName}, ${country}</h3>
      <p>🌡️ Temperature: ${temp} °C</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>☁️ Weather: ${description}</p>
      <p>🌧️ Chance of Rain: ${rainChance}%</p>
      <h4>📅 3-Hourly Forecast</h4>
    `;

    // Show next 5 forecasts (3-hourly)
    html += "<ul>";
    data.list.slice(0, 6).forEach(item => {
      const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const t = item.main.temp;
      const desc = item.weather[0].description;
      const pop = item.pop !== undefined ? (item.pop * 100).toFixed(0) : 0;
      html += `<li><b>${time}</b> → 🌡️ ${t} °C, ☁️ ${desc}, 🌧️ ${pop}%</li>`;
    });
    html += "</ul>";

    resultDiv.innerHTML = html;
  } catch (error) {
    resultDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}
