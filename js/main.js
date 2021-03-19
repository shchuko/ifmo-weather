function removeFromList(list, cityName) {
  const index = list.indexOf(cityName);
  if (index > -1) {
    list.splice(index, 1);
  }
}

window.onload = () => {
  refreshLocationListener();

  favorites = loadStoredFavorites()
  displayedFavorites = []

  favorites.forEach(cityName => addFavCity(cityName, console.log));
}
