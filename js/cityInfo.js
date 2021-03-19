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
    city.iconSrc = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
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
    city.iconSrc = `resources/refresh.png`;
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
