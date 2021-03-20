const defaultCityName = 'Helsinki';

function updateMainCityHtml(cityInfo, headerText) {
  const getElem = (elem) => document.getElementById(elem);
  getElem('main-header').innerText = headerText;
  getElem('main-city-name').innerHTML = cityInfo.name;
  getElem('main-weather-icon').src = cityInfo.iconSrc;
  getElem('main-city-temperature').innerHTML = `${cityInfo.temperature}&#176;C`;
  getElem('main-city-wind').innerHTML = `${cityInfo.windSpeed} m/s, ${cityInfo.windDirection}`;
  getElem('main-city-clouds').innerHTML = cityInfo.cloudiness;
  getElem('main-city-pressure').innerHTML = `${cityInfo.pressure}hPa`;
  getElem('main-city-humidity').innerHTML = `${cityInfo.humidity}%`;
  getElem('main-city-loc').innerHTML = `[${cityInfo.locationLat}, ${cityInfo.locationLon}]`;
}

function updateMainCityHtmlEmpty() {
  updateMainCityHtml(CityInfo.buildEmpty('---'), '---');
}

function updateMainCityHtmlDefaultLocation(cityInfo) {
  updateMainCityHtml(cityInfo, 'Default location');
}

function updateMainCityHtmlAutoLocation(cityInfo) {
  updateMainCityHtml(cityInfo, 'Weather here');
}

function mainCityFillFromCurrent(pos) {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  let onSuccess = (response) => {
    updateMainCityHtmlAutoLocation(CityInfo.buildFromResponse(response));
  };

  let onFail = () => {
    mainCityFillFromDefault();
  };

  safeRequestWeatherInfoFromLocation(lat, lon, onSuccess, onFail);
}

function mainCityFillFromDefault() {
  let onSuccess = (response) => {
    updateMainCityHtmlDefaultLocation(CityInfo.buildFromResponse(response));
  };

  let onFail = () => {
    updateMainCityHtmlEmpty();
  };

  safeRequestWeatherInfoFromName(defaultCityName, onSuccess, onFail);
}

function refreshLocationListener() {
  updateMainCityHtmlEmpty();
  navigator.geolocation.getCurrentPosition(mainCityFillFromCurrent,
      mainCityFillFromDefault);
}
