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

function createFavoriteCityHtml(cityInfo) {
  return `<div class="minimal-info">
                <h3>${cityInfo.name}</h3>
                <span class="temperature">${cityInfo.temperature}&#176;C</span>
                <img class="weather-icon"
                     src="${cityInfo.iconSrc}"
                     alt="Weather icon">
                <button class="btn-circle btn-remove" onclick="removeFavCityListener('${cityInfo.name}', this.parentElement.parentElement)">X</button>
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
            </ul>`;
}

function addFavCityListItem(cityName, innerHtml) {
  let favCityListItem = document.createElement("li");
  favCityListItem.className = 'fav-city';
  favCityListItem.innerHTML = innerHtml;

  document.getElementById('fav-cities').prepend(favCityListItem);
  displayedFavsLoading.push(cityName);
  return favCityListItem;
}

function updateFavCityListItem(item, innerHtml) {
  item.innerHTML = innerHtml;
}

function addFavCity(requestCityName, messageFunc) {
  if (isCityDisplayed(requestCityName) || isCityDisplayedLoading(
      requestCityName)) {
    return;
  }

  let cityInfo = CityInfo.buildEmpty(requestCityName);
  let innerHtml = createFavoriteCityHtml(cityInfo);
  let favCityListItem = addFavCityListItem(requestCityName, innerHtml);

  let onSuccess = (response) => {
    cityInfo = CityInfo.buildFromResponse(response);
    innerHtml = createFavoriteCityHtml(cityInfo);
    // Double-check for case when name from response != name from request
    if (isCityDisplayed(cityInfo.name)) {
      removeFromList(displayedFavsLoading, requestCityName);
      favCityListItem.remove();
    } else {
      updateFavCityListItem(favCityListItem, innerHtml);
      saveCityToFavorites(cityInfo.name);

      removeFromList(displayedFavsLoading, requestCityName);
      displayedFavorites.push(cityInfo.name);
    }
  };

  let onFail = () => {
    favCityListItem.remove();
    removeFromList(displayedFavsLoading, requestCityName);
    messageFunc(`'${requestCityName}' adding error!`);
  };
  safeRequestWeatherInfoFromName(requestCityName, onSuccess, onFail);
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
