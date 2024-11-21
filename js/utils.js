export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get the correct card image URL
export const getCardImageUrl = (card, isMDFC, isModal = false) => {
  if (isMDFC) {
    return card.card_faces[0].image_uris
      ? isModal
        ? card.card_faces[0].image_uris.art_crop
        : card.card_faces[0].image_uris.normal
      : 'https://placehold.co/400';
  } else {
    return card.image_uris
      ? isModal
        ? card.image_uris.art_crop
        : card.image_uris.normal
      : 'https://placehold.co/400';
  }
};

// Helper to get power and toughness (if applicable)
export const getCardPowerToughness = (card, isMDFC) => {
  const powerToughness = isMDFC
    ? card.card_faces
        .map((face) =>
          face.power && face.toughness
            ? `<p class="fs-3 fw-bold m-0 mb-2 px-2 py-1 bg-black bg-opacity-50 rounded-1">${face.power} / ${face.toughness}</p>`
            : ''
        )
        .filter((pt) => pt)
        .join(' // ')
    : card.power && card.toughness
    ? `<p class="fs-3 fw-bold m-0 mb-2 px-2 py-1 bg-black bg-opacity-50 rounded-1">${card.power} / ${card.toughness}</p>`
    : '';
  return powerToughness;
};

// Helper to get the mana cost of a card
export const getCardCost = (card, isMDFC) => {
  return isMDFC ? card.card_faces.map((face) => face.mana_cost).join(' // ') : card.mana_cost;
};
