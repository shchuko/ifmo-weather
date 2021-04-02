const serverAddress = "localhost:8076";
const requestUrlPrefix = `http://${serverAddress}`;
const weatherCityUrl = `${requestUrlPrefix}/weather/city`;
const weatherCoordinatesUrl = `${requestUrlPrefix}/weather/coordinates`;
const favouritesUrl = `${requestUrlPrefix}/favourites`;

async function requestWeatherInfoByName(cityName) {
    let response = await fetch(`${weatherCityUrl}?q=${cityName}`);
    if (response.status === 200) {
        return await response.json();
    }
    throw new Error(`Request errored with status ${response.status}`);
}

async function requestWeatherInfoByLocation(lat, lon) {
    let response = await fetch(`${weatherCoordinatesUrl}?lat=${lat}&long=${lon}`);
    if (response.status === 200) {
        return await response.json();
    }
    throw new Error(`Request errored with status ${response.status}`);
}

async function requestGetFavourites() {
    let response = await fetch(favouritesUrl);
    if (response.status === 200) {
        const json = await response.json();
        return json.favouriteCitiesNames;
    }
    throw new Error(`Request errored with status ${response.status}`);
}

async function requestAddFavouriteCity(cityName) {
    let response = await fetch(`${favouritesUrl}?q=${cityName}`, {method: "POST"});
    if (response.status === 200) {
        return await response.json();
    }

    if (response.status === 409) {
        return false;
    }

    throw new Error(`Request errored with status ${response.status}`);
}

async function requestDeleteFavouriteCity(cityName) {
    let response = await fetch(`${favouritesUrl}?q=${cityName}`, {method: "DELETE"});
    if (response.status !== 200) {
        throw new Error(`Request errored with status ${response.status}`);
    }
}
