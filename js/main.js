const apiKey = "5c27a2fcde1f7a149db13d0228f9d05f";
const requestUrlPrefix = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}&`;
const favoritesKeyName = 'favorites';
const defaultCityName = 'Helsinki';

let favorites
let displayedFavorites = []
let displayedFavsLoading = []

class CityInfo {
  name;
  temperature;
  iconSrc;
  windSpeed;
  windDirection;
  cloudiness;
  pressure;
  humidity;
  locationLat;
  locationLon;

  static buildFromResponse(response) {
    let city = new CityInfo();

    city.name = response.name;
    city.temperature = Math.round(response.main.temp);
    city.iconSrc = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
    city.windSpeed = response.wind.speed;
    city.windDirection = CityInfo.#convertWindDirection(response.wind.deg);
    // Set to Upper first character of 'cloudiness'
    city.cloudiness = response.weather[0].description.charAt(0).toUpperCase()
        + response.weather[0].description.slice(1);
    city.pressure = response.main.pressure;
    city.humidity = response.main.humidity;
    city.locationLat = response.coord.lat;
    city.locationLon = response.coord.lon;

    return city;
  }

  static buildEmpty(cityName) {
    let city = new CityInfo();

    city.name = cityName;
    city.temperature = "-";
    city.iconSrc = `resources/refresh.png`
    city.windSpeed = "-";
    city.windDirection = "-";
    city.cloudiness = "-";
    city.pressure = "-";
    city.humidity = "-";
    city.locationLat = "-";
    city.locationLon = "-";

    return city;
  }

  static #convertWindDirection(deg) {
    if (deg > 337.5) {
      return 'N';
    }
    if (deg > 292.5) {
      return 'NW';
    }
    if (deg > 247.5) {
      return 'W';
    }
    if (deg > 202.5) {
      return 'SW';
    }
    if (deg > 157.5) {
      return 'S';
    }
    if (deg > 122.5) {
      return 'SE';
    }
    if (deg > 67.5) {
      return 'E';
    }
    if (deg > 22.5) {
      return 'NE';
    }
    return 'N';
  }
}

window.onload = () => {
  document.getElementById('main-city').innerHTML = createMainCityHtml(
      CityInfo.buildEmpty(defaultCityName));
  refreshLocationListener();

  favorites = loadStoredFavorites()
  displayedFavorites = []

  favorites.forEach(cityName => addFavCity(cityName, console.log));
}

function removeFromList(list, cityName) {
  const index = list.indexOf(cityName);
  if (index > -1) {
    list.splice(index, 1);
  }
}

function isCityInFavorites(cityName) {
  return favorites.includes(cityName)
}

function isCityDisplayed(cityName) {
  return displayedFavorites.includes(cityName)
}

function isCityDisplayedLoading(cityName) {
  return displayedFavsLoading.includes(cityName)
}

function loadStoredFavorites() {
  let savesFavorites = localStorage.getItem(favoritesKeyName)
  let parsedFavorites = []

  if (savesFavorites == null || savesFavorites === '') {
    return parsedFavorites
  }

  try {
    parsedFavorites = JSON.parse(savesFavorites);
  } catch (e) {
    console.log(e);
    console.log('Local storage will be cleared')
    localStorage.removeItem(favoritesKeyName)
  }

  return parsedFavorites
}

function updateLocalStorage() {
  localStorage.setItem(favoritesKeyName, JSON.stringify(favorites))
}

function saveCityToFavorites(cityName) {
  if (isCityInFavorites(cityName)) {
    return
  }

  favorites.push(cityName)
  updateLocalStorage()
}

/**
 * Safely requests city info, on success passes response to responseHandler.
 *
 * @param requestSuffix Request suffix
 * @param responseHandler Response handler will be called on successful request
 * @param onFail Will be invoked on request fail
 */
function safeRequestWeatherInfo(requestSuffix, responseHandler, onFail) {
  let url = `${requestUrlPrefix}${requestSuffix}`;
  fetch(url)
  .then(response => {
    response.json().then(json => {
      if (json.cod !== 200) {
        console.log('Request unsuccessful, return code != 200')
        onFail()
      } else {
        responseHandler(json)
      }
    })
  })
  .catch((err) => {
    onFail()
    console.log(err);
  })
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
  displayedFavsLoading.push(cityName)
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
      removeFromList(displayedFavsLoading, requestCityName)
      favCityListItem.remove();
    } else {
      updateFavCityListItem(favCityListItem, innerHtml);
      saveCityToFavorites(cityInfo.name);

      removeFromList(displayedFavsLoading, requestCityName)
      displayedFavorites.push(cityInfo.name)
    }
  }

  let onFail = () => {
    favCityListItem.remove();
    removeFromList(displayedFavsLoading, requestCityName);
    messageFunc(`'${requestCityName}' adding error!`)
  }
  safeRequestWeatherInfo(`q=${requestCityName}`, onSuccess, onFail)

}

function addFavCityListener() {
  const input = document.getElementById('add-city-input');
  const value = input.value.trim();
  input.value = ''
  if (value !== '') {
    addFavCity(value, alert);
  }
}

function removeFavCityListener(cityName, listElement) {
  listElement.remove()
  removeFromList(favorites, cityName);
  removeFromList(displayedFavorites, cityName);
  updateLocalStorage();
}

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
  const reqSuffix = `lat=${lat}&lon=${lon}`;

  let onSuccess = (response) => {
    document.getElementById('main-city').innerHTML = createMainCityHtml(
        CityInfo.buildFromResponse(response));
  }

  let onFail = () => {
    mainCityFillFromDefault();
  }

  safeRequestWeatherInfo(reqSuffix, onSuccess, onFail);
}

function mainCityFillFromDefault() {
  alert("Location retrieval error, using default")
  const reqSuffix = `q=${defaultCityName}`;

  let onSuccess = (response) => {
    document.getElementById('main-city').innerHTML = createMainCityHtml(
        CityInfo.buildFromResponse(response));
  }

  let onFail = () => {
    alert("Fatal error, leaving main city empty");
    document.getElementById('main-city').innerHTML = createMainCityHtml(
        CityInfo.buildEmpty(defaultCityName));
  }

  safeRequestWeatherInfo(reqSuffix, onSuccess, onFail);
}

function refreshLocationListener() {
  navigator.geolocation.getCurrentPosition(mainCityFillFromCurrent,
      mainCityFillFromDefault);
}
