const defaultCityName = 'Helsinki';

function updateMainCityHtml(cityInfo, headerText) {
  const getElem = (elem) => document.getElementById(elem);
  const metricHtml = cityInfo.getMetricHtml();

  getElem('main-header').innerText = headerText;
  getElem('main-city-name').innerHTML = metricHtml.nameHtml;
  getElem('main-weather-icon').src = cityInfo.iconSrc;
  getElem('main-city-temperature').innerHTML = metricHtml.temperatureHtml;
  getElem('main-city-wind').innerHTML = metricHtml.windHtml;
  getElem('main-city-clouds').innerHTML = metricHtml.cloudinessHtml;
  getElem('main-city-pressure').innerHTML = metricHtml.pressureHtml;
  getElem('main-city-humidity').innerHTML = metricHtml.humidityHtml;
  getElem('main-city-loc').innerHTML = metricHtml.locationHtml;
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

  let onFail = (e) => {
    console.log(e);
    mainCityFillFromDefault();
  };

  requestWeatherInfoFromLocation(lat, lon).then(onSuccess).catch(onFail);
}

function mainCityFillFromDefault() {
  let onSuccess = (response) => {
    updateMainCityHtmlDefaultLocation(CityInfo.buildFromResponse(response));
  };

  let onFail = (e) => {
    console.log(e);
    updateMainCityHtmlEmpty();
  };

  requestWeatherInfoFromName(defaultCityName).then(onSuccess).catch(onFail)
}

function refreshLocationListener() {
  updateMainCityHtmlEmpty();
  navigator.geolocation.getCurrentPosition(mainCityFillFromCurrent,
      mainCityFillFromDefault);
}
