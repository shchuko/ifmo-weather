const defaultCityName = 'Helsinki';

function createMainCityHtml(cityInfo) {
  return `<div id="main-city-minimal-info">
            <h3 id="main-city-name">${cityInfo.name}</h3>
            <div class="weather-icon-temp">
                <img class="weather-icon"
                     id="main-weather-icon"
                     src="${cityInfo.iconSrc}"
                     alt="Weather icon">
                <span class="temperature" id="main-city-temperature">${cityInfo.temperature}&#176;C</span>
            </div>
        </div>
        <ul class="extended-info">
            <li class="extended-info-li">
                <span class="info-type">Wind</span>
                <span class="info-value">${cityInfo.windSpeed} m/s, ${cityInfo.windDirection}</span>
            </li>
            <li class="extended-info-li">
                <span class="info-type">Cloudiness</span>
                <span class="info-value">${cityInfo.cloudiness}</span>
            </li>
            <li class="extended-info-li">
                <span class="info-type">Pressure</span>
                <span class="info-value">${cityInfo.pressure}hPa</span>
            </li>
            <li class="extended-info-li">
                <span class="info-type">Humidity</span>
                <span class="info-value">${cityInfo.humidity}%</span>
            </li>
            <li class="extended-info-li">
                <span class="info-type">Location</span>
                <span class="info-value">[${cityInfo.locationLat}, ${cityInfo.locationLon}]</span>
            </li>
        </ul>`
}

function mainCityFillFromCurrent(pos) {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  let onSuccess = (response) => {
    document.getElementById('main-city').innerHTML = createMainCityHtml(
        CityInfo.buildFromResponse(response));
  }

  let onFail = () => {
    mainCityFillFromDefault();
  }

  safeRequestWeatherInfoFromLocation(lat, lon, onSuccess, onFail);
}

function mainCityFillFromDefault() {
  alert("Location retrieval error, using default")

  let onSuccess = (response) => {
    document.getElementById('main-city').innerHTML = createMainCityHtml(
        CityInfo.buildFromResponse(response));
  }

  let onFail = () => {
    alert("Fatal error, leaving main city empty");
    document.getElementById('main-city').innerHTML = createMainCityHtml(
        CityInfo.buildEmpty(defaultCityName));
  }

  safeRequestWeatherInfoFromName(defaultCityName, onSuccess, onFail);
}

function refreshLocationListener() {
  document.getElementById('main-city').innerHTML = createMainCityHtml(
      CityInfo.buildEmpty(defaultCityName));

  navigator.geolocation.getCurrentPosition(mainCityFillFromCurrent,
      mainCityFillFromDefault);
}
