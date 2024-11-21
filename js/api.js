import { symbolCache, cardCache } from './caches.js';
import { delay } from './utils.js';

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
    console.error('Error fetching mana symbols:', error);
  }
};

export const fetchCardData = async (query) => {
  if (cardCache[query]) {
    console.log('Spell has been resolved:', query);
    return cardCache[query];
  }

  await delay(1000); // Simulate network latency

  try {
    const response = await fetch(`https://api.scryfall.com/cards/search?q=${query}`);

    if (!response.ok) {
      throw new Error('Counter Spell: Error fetching data');
    }

    const data = await response.json();

    // Store data in cache
    cardCache[query] = data;
    return data;
  } catch (error) {
    console.error('Counter Spell: Error fetching data:', error);
    throw new Error('Counter Spell: Error fetching data');
  }
};
