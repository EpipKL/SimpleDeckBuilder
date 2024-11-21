import { generalSearch, generalSearchButton, searchResultsContainer } from './js/dom.js';
import { cardCache } from './js/caches.js';
import { fetchCardData } from './js/api.js';
import { updateSearchResults } from './js/results.js';
import { renderDeck } from './js/deck.js';

// Handle search button click
generalSearchButton.addEventListener('click', async (event) => {
  event.preventDefault();

  const showAlert = (message, type) => {
    const alertSearchPlaceholder = document.querySelector('#alert-search-placeholder');

    // Check if the element exsists in the DOM
    if (!alertSearchPlaceholder) {
      console.error('Alert placeholder not found');
      return;
    }

    alertSearchPlaceholder.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show mt-2 mx-5" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
  };

  const query = generalSearch.value.trim();

  if (!query) {
    showAlert('Please enter a search query', 'warning');
    return;
  }

  try {
    let data;

    // Dynamically add the loader to the search results container.
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.classList.add('text-center', 'my-3');
    loader.innerHTML = `
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
    searchResultsContainer.appendChild(loader);

    // Force a repaint to ensure loader visibility
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Clear other content in #search-results, except the loader
    [...searchResultsContainer.children].forEach((child) => {
      if (child.id !== 'loader' && child.id !== 'alert-search-placeholder') {
        child.remove();
      }
    });

    // Check if the data is already cached
    if (cardCache[query]) {
      console.log('Using cached data for:', query);
      data = cardCache[query];
    } else {
      // Fetch data from the network if not cached
      console.log('Fetching new data for:', query);
      data = await fetchCardData(query);
      // Cache the data for future use
      cardCache[query] = data;
    }

    // Update the search results with the retrieved data
    updateSearchResults(data);
  } catch (error) {
    showAlert('Counter Spell: ' + error.message, 'danger');
  } finally {
    // Hide the loader after updating results or if an error occurs
    loader.remove();
  }

  generalSearch.value = '';
});

// Add event listener to clear deck button
document.getElementById('clear-button').addEventListener('click', () => {
  deck = {
    commander: [],
    mainboard: [],
    sideboard: [],
  };
  renderDeck();
});
