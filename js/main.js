function removeFromList(list, cityName) {
  const index = list.indexOf(cityName);
  if (index > -1) {
    list.splice(index, 1);
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
