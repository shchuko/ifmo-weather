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

    getMetricHtml() {
        return new CityInfoMetricHtml(this);
    }

    static buildFromResponse(response) {
        let city = new CityInfo();

        city.name = response.name;
        city.temperature = response.temperature;
        city.iconSrc = response.iconSrc;
        city.windSpeed = response.windSpeed;
        city.windDirection = response.windDirection;
        city.cloudiness = response.cloudiness;
        city.pressure = response.pressure;
        city.humidity = response.humidity;
        city.locationLat = response.locationLat;
        city.locationLon = response.locationLon;

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

    static convertWindDirection(deg) {
        if (deg > 337.5) {
            return "N";
        }
        if (deg > 292.5) {
            return "NW";
        }
        if (deg > 247.5) {
            return "W";
        }
        if (deg > 202.5) {
            return "SW";
        }
        if (deg > 157.5) {
            return "S";
        }
        if (deg > 122.5) {
            return "SE";
        }
        if (deg > 67.5) {
            return "E";
        }
        if (deg > 22.5) {
            return "NE";
        }
        return "N";
    }
}

class CityInfoHtml {
    nameHtml;
    temperatureHtml;
    windHtml;
    cloudinessHtml;
    pressureHtml;
    humidityHtml;
    locationHtml;
    locationLon;

    constructor() {

    }
}

class CityInfoMetricHtml extends CityInfoHtml {
    constructor(cityInfo) {
        super();
        this.nameHtml = cityInfo.name;
        this.temperatureHtml = `${cityInfo.temperature}&#176;C`;
        this.windHtml = `${cityInfo.windSpeed} m/s, ${cityInfo.windDirection}`;
        this.cloudinessHtml = cityInfo.cloudiness;
        this.pressureHtml = `${cityInfo.pressure}hPa`;
        this.humidityHtml = `${cityInfo.humidity}%`;
        this.locationHtml = `[${cityInfo.locationLat}, ${cityInfo.locationLon}]`;
    }
}
