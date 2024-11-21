// Cache for symbol data
const symbolCache = {};

// Function to fetch mana symbols from API
export const fetchManaSymbols = async () => {
  if (symbolCache.data) {
    return symbolCache.data;
  }

  try {
    const response = await fetch(`https://api.scryfall.com/symbology`);
    const data = await response.json();

    // Cache the symbols data
    symbolCache.data = data.data.reduce((map, symbol) => {
      map[symbol.symbol] = symbol.svg_uri;
      return map;
    }, {});
    return symbolCache.data;
  } catch (error) {
    console.error('Error fetching mana symbols', error);
  }
};
