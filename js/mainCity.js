const defaultCityName = 'Helsinki';

function updateMainCityHtml(cityInfo) {
  const getElem = (elem) => document.getElementById(elem);
  getElem('main-city-name').innerHTML = cityInfo.name;
  getElem('main-weather-icon').src = cityInfo.iconSrc;
  getElem('main-city-temperature').innerHTML = `${cityInfo.temperature}&#176;C`;
  getElem('main-city-wind').innerHTML = `${cityInfo.windSpeed} m/s, ${cityInfo.windDirection}`;
  getElem('main-city-clouds').innerHTML = cityInfo.cloudiness;
  getElem('main-city-pressure').innerHTML = `${cityInfo.pressure}hPa`;
  getElem('main-city-humidity').innerHTML = `${cityInfo.humidity}%`;
  getElem('main-city-loc').innerHTML = `[${cityInfo.locationLat}, ${cityInfo.locationLon}]`;
}

function mainCityFillFromCurrent(pos) {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  let onSuccess = (response) => {
    updateMainCityHtml(CityInfo.buildFromResponse(response));
  };

  let onFail = () => {
    mainCityFillFromDefault();
  };

  safeRequestWeatherInfoFromLocation(lat, lon, onSuccess, onFail);
}

function mainCityFillFromDefault() {
  alert("Location retrieval error, using default");

  let onSuccess = (response) => {
    updateMainCityHtml(CityInfo.buildFromResponse(response));
  };

  let onFail = () => {
    alert("Fatal error, leaving main city empty");
    updateMainCityHtml(CityInfo.buildEmpty(defaultCityName));
  };

  safeRequestWeatherInfoFromName(defaultCityName, onSuccess, onFail);
}

function refreshLocationListener() {
  updateMainCityHtml(CityInfo.buildEmpty(defaultCityName));
  navigator.geolocation.getCurrentPosition(mainCityFillFromCurrent,
      mainCityFillFromDefault);
}
