const favoritesKeyName = 'favorites';
let favorites;

function loadStoredFavorites() {
  let savesFavorites = localStorage.getItem(favoritesKeyName);
  let parsedFavorites = [];

  if (savesFavorites == null || savesFavorites === '') {
    return parsedFavorites;
  }

  try {
    parsedFavorites = JSON.parse(savesFavorites);
  } catch (e) {
    console.log(e);
    console.log('Local storage will be cleared');
    localStorage.removeItem(favoritesKeyName);
  }

  return parsedFavorites;
}

function updateLocalStorage() {
  localStorage.setItem(favoritesKeyName, JSON.stringify(favorites));
}

function isCityInFavorites(cityName) {
  return favorites.includes(cityName);
}
