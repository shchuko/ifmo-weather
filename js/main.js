window.onload = () => {
    requestGetFavourites()
        .then(favorites => {
            favorites.forEach(cityName => addFavCity(cityName, console.log, requestWeatherInfoByName));
        })
        .catch(console.log);

    addFavCityKeyPressListener();
    refreshLocationListener();
};
