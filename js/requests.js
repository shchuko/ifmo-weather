const apiKey = "5c27a2fcde1f7a149db13d0228f9d05f";
const requestUrlPrefix = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}&`;

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
        console.log('Request unsuccessful, return code != 200');
        onFail();
      } else {
        responseHandler(json);
      }
    });
  })
  .catch((err) => {
    onFail();
    console.log(err);
  });
}

function safeRequestWeatherInfoFromName(cityName, responseHandler, onFail) {
  safeRequestWeatherInfo(`q=${cityName}`, responseHandler, onFail);
}

function safeRequestWeatherInfoFromLocation(lat, lon, responseHandler, onFail) {
  safeRequestWeatherInfo(`lat=${lat}&lon=${lon}`, responseHandler, onFail);
}