function fillFavCityListItem(listItem, cityInfo) {
    const getField = (tag) => listItem.querySelectorAll(tag)[0];
    const metricHtml = cityInfo.getMetricHtml();

    getField("h3").innerText = metricHtml.nameHtml;
    getField(".temperature").innerHTML = metricHtml.temperatureHtml;
    getField(".weather-icon").src = cityInfo.iconSrc;
    getField(".btn-remove").addEventListener("click",
        () => removeFavCityListener(cityInfo.name, listItem));
    getField(".info-value.wind").innerHTML = metricHtml.windHtml;
    getField(".info-value.cloudiness").innerHTML = metricHtml.cloudinessHtml;
    getField(".info-value.pressure").innerHTML = metricHtml.pressureHtml;
    getField(".info-value.humidity").innerHTML = metricHtml.humidityHtml;
    getField(".info-value.location").innerHTML = metricHtml.locationHtml;
}

function createFavCityListItem(cityName, cityInfo) {
    let listItem = document.createElement("li");
    listItem.className = "fav-city";
    listItem.append(
        document.getElementById("fav-city-template").content.cloneNode(
            true));
    fillFavCityListItem(listItem, cityInfo);
    return listItem;
}

function insertFavCityListItem(listItem) {
    document.getElementById("fav-cities").prepend(listItem);
}

function addFavCity(requestCityName, messageFunc, requestCallback) {
    let listItem = createFavCityListItem(requestCityName, CityInfo.buildEmpty(requestCityName));
    insertFavCityListItem(listItem);

    let onSuccess = (response) => {
        // Response may be false when the city already exists
        if (response === false) {
            listItem.remove();
            
            return;
        }

        fillFavCityListItem(listItem, CityInfo.buildFromResponse(response));
    };

    let onFail = (e) => {
        console.log(e);
        listItem.remove();
        messageFunc(`'${requestCityName}' adding error!`);
    };

    requestCallback(requestCityName).then(onSuccess).catch(onFail);
}

function addFavCityListener() {
    const input = document.getElementById("add-city-input");
    const value = input.value.trim();
    input.value = "";
    if (value !== "") {
        addFavCity(value, alert, requestAddFavouriteCity);
    }
}

function addFavCityKeyPressListener() {
    document.getElementById("add-city-input").addEventListener("keypress",
        function (e) {
            if (e.key === "Enter") {
                addFavCityListener();
            }
        });
}

function removeFavCityListener(cityName, listElement) {
    const onSuccess = () => {
        listElement.remove();
    };

    const onFail = (e) => {
        console.log(e);
    };
    requestDeleteFavouriteCity(cityName).then(onSuccess).catch(onFail);
}
