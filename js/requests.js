const apiKey = "5c27a2fcde1f7a149db13d0228f9d05f";
const requestUrlPrefix = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}&`;

async function requestWeatherInfo(requestSuffix) {
  let url = `${requestUrlPrefix}${requestSuffix}`;
  let response = await fetch(url);
  if (response.status === 200) {
    return await response.json();
  }
  throw new Error(`Request errored with status ${response.status}`);
}

async function requestWeatherInfoFromName(cityName) {
  return requestWeatherInfo(`q=${cityName}`);
}

async function requestWeatherInfoFromLocation(lat, lon) {
  return requestWeatherInfo(`lat=${lat}&lon=${lon}`);
}