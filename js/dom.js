export const generalSearch = document.getElementById('general-search');
export const generalSearchButton = document.getElementById('general-search-button');
export const searchResultsContainer = document.getElementById('search-results');

// Add to deck button to search results
export const addCardButtonLogic = (card) => {
  console.log('Creating add to deck button for card:', card.name);
  console.log('addCardToDeck called with: ', card);
  const addCardButton = document.createElement('button');
  addCardButton.textContent = 'Add to Deck';
  addCardButton.className = 'btn btn-success';
  addCardButton.setAttribute('data-card-id', card.id);
  addCardButton.setAttribute('data-card-name', card.name);
  addCardButton.addEventListener('click', () => {
    console.log(`Adding card to deck: ${card.name}`); // Log card name to console
    addCardToDeck(card);
    console.log('Deck:', deck); // Log deck to console
  });
  return addCardButton;
};
