import { searchResultsContainer } from './dom.js';
import { getCleanedOracleText } from './oracle.js';
import { getCardModal, generateCardDisplay } from './card.js';
import { deck } from './deck.js';
import { createAddCardModal } from './modal.js';

// Update search results
export const updateSearchResults = (data) => {
  searchResultsContainer.innerHTML = `
      <div class="d-flex align-items-center position-relative">
        <h2 class="ms-2">Search Results</h2>
        <p class="align-self-center m-0 ms-2 fw-light">
            <sm>Found ${data.total_cards} cards</sm>
        </p>
      </div>
      <div class="container text-center">
        <div class="row">
          ${data.data
            .map((card) => {
              const cleanedOracleText = getCleanedOracleText(card);
              return (
                generateCardDisplay(card, cleanedOracleText) + getCardModal(card, cleanedOracleText)
              );
            })
            .join('')}
        </div>
      </div>
    `;

  searchResultsContainer.addEventListener('click', (event) => {
    if (event.target.matches('.btn-success')) {
      const cardId = event.target.getAttribute('data-card-id');
      const card = data.data.find((c) => c.id === cardId);
      if (card) {
        addCardToDeck(card);
      } else {
        console.error(`Card with ID ${cardId} not found`);
      }
    }
  });
};

// Function to add card to deck
const addCardToDeck = (card) => {
  console.log('addCardToDeck function called');
  console.log(card); // This should log the card object

  if (!deck) {
    console.error('Deck not initialized');
    return;
  }

  if (!card) {
    console.error('Card is undefined in addCardToDeck');
    return; // Early exit if the card is not defined
  }

  // Create and show the modal with the card object
  const addCardModal = createAddCardModal(card);
  addCardModal.show();
};
