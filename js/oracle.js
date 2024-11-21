import { fetchManaSymbols } from './api.js';

// Generate cleaned oracle data
export const getCleanedOracleText = (card) => {
  const isMDFC = card.card_faces && card.card_faces.length > 0;

  const oracleTextArray = isMDFC
    ? card.card_faces.map((face) => face.oracle_text || 'No oracle text available')
    : [card.oracle_text || 'No oracle text available'];

  // Get symbol data
  const symbols = fetchManaSymbols();

  // console.log('Oracle Text:', oracleTextArray);
  // console.log('Type:', typeof oracleTextArray);

  // Clean each oracle text entry
  const cleanedOracleText = oracleTextArray.map((text) =>
    text
      .replace(/^\s+|\s+$/g, '') // Remove leading/trailing whitespace
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
      .replace(/\n/g, '<br>') // Replace newlines with <br> for HTML rendering
      .replace(/\{([A-Z0-9]+)\}/g, (match) => {
        const symbol = `{${match.slice(1, -1)}}`; // e.g., "{U}"
        const symbolUrl = symbols[symbol];
        return symbolUrl
          ? `<img src="${symbolUrl}" alt="${symbol}" style="width: 1em; height: 1em;">`
          : match; // If no symbol found, return original match
      })
  );

  return cleanedOracleText.join('<br><br>');
};
