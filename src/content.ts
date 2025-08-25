// Content script for Upwork Search Optimizer
// This script runs on Upwork pages to provide additional functionality

console.log("Upwork Search Optimizer content script loaded");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCurrentUrl") {
    sendResponse({ url: window.location.href });
  }

  if (request.action === "updateSearch") {
    // Update the current page search if we're on a search results page
    const searchInput = document.querySelector(
      'input[data-test="search-input"]'
    ) as HTMLInputElement;
    if (searchInput && request.keywords) {
      searchInput.value = request.keywords;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));

      // Trigger search
      const searchButton = document.querySelector(
        '[data-test="search-button"]'
      ) as HTMLButtonElement;
      if (searchButton) {
        searchButton.click();
      }
    }
  }
});

// Optionally, you can add visual indicators or other enhancements here
// For example, highlighting certain job posts or adding custom filters
