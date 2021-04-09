let displayedFavorites = [];
let displayedFavsLoading = [];

function isCityDisplayed(cityName) {
  return displayedFavorites.includes(cityName);
}

function isCityDisplayedLoading(cityName) {
  return displayedFavsLoading.includes(cityName);
}

function saveCityToFavorites(cityName) {
  if (isCityInFavorites(cityName)) {
    return;
  }

  favorites.push(cityName);
  updateLocalStorage();
}

function fillFavCityListItem(listItem, cityInfo, addEventListener = false) {
  const getField = (tag) => listItem.querySelectorAll(tag)[0];
  const metricHtml = cityInfo.getMetricHtml();

  getField('h3').innerText = metricHtml.nameHtml;
  getField('.temperature').innerHTML = metricHtml.temperatureHtml;
  getField('.weather-icon').src = cityInfo.iconSrc;
  if (addEventListener) {
    getField(".btn-remove").addEventListener("click", () => removeFavCityListener(cityInfo.name, listItem));
  }
  getField('.info-value.wind').innerHTML = metricHtml.windHtml;
  getField('.info-value.cloudiness').innerHTML = metricHtml.cloudinessHtml;
  getField('.info-value.pressure').innerHTML = metricHtml.pressureHtml;
  getField('.info-value.humidity').innerHTML = metricHtml.humidityHtml;
  getField('.info-value.location').innerHTML = metricHtml.locationHtml;
}

function createFavCityListItem(cityName, cityInfo) {
  let listItem = document.createElement("li");
  listItem.className = 'fav-city';
  listItem.append(
      document.getElementById('fav-city-template').content.cloneNode(
          true));
  fillFavCityListItem(listItem, cityInfo);
  return listItem;
}

function insertFavCityListItem(listItem, cityName) {
  document.getElementById('fav-cities').prepend(listItem);
  displayedFavsLoading.push(cityName);
}

function addFavCity(requestCityName, messageFunc) {
  if (isCityDisplayed(requestCityName) || isCityDisplayedLoading(
      requestCityName)) {
    return;
  }
  let listItem = createFavCityListItem(requestCityName,
      CityInfo.buildEmpty(requestCityName));
  insertFavCityListItem(listItem, requestCityName);

  let onSuccess = (response) => {
    let cityInfo = CityInfo.buildFromResponse(response);
    // Double-check for case when name from response != name from request
    if (isCityDisplayed(cityInfo.name)) {
      removeFromList(displayedFavsLoading, requestCityName);
      listItem.remove();
    } else {
      fillFavCityListItem(listItem, cityInfo, true);
      saveCityToFavorites(cityInfo.name);

      removeFromList(displayedFavsLoading, requestCityName);
      displayedFavorites.push(cityInfo.name);
    }
  };

  let onFail = (e) => {
    console.log(e)
    listItem.remove();
    removeFromList(displayedFavsLoading, requestCityName);
    messageFunc(`'${requestCityName}' adding error!`);
  };
  requestWeatherInfoFromName(requestCityName).then(onSuccess).catch(onFail);
}

function addFavCityListener() {
  const input = document.getElementById('add-city-input');
  const value = input.value.trim();
  input.value = '';
  if (value !== '') {
    addFavCity(value, alert);
  }
}

function addFavCityKeyPressListener() {
  document.getElementById('add-city-input').addEventListener('keypress',
      function (e) {
        if (e.key === 'Enter') {
          addFavCityListener();
        }
      });
}

function removeFavCityListener(cityName, listElement) {
  listElement.remove();
  removeFromList(favorites, cityName);
  removeFromList(displayedFavorites, cityName);
  updateLocalStorage();
}
