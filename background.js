// Initialisation : l'extension est désactivée par défaut
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isEnabled: false });
  updateBadge(false);
});

// Écoute l'événement OnDownloadCreated
chrome.downloads.onCreated.addListener((downloadItem) => {
  chrome.storage.local.get(['isEnabled'], (result) => {
    if (result.isEnabled) {
      // Annule immédiatement le téléchargement sans le supprimer de l'historique
      chrome.downloads.cancel(downloadItem.id, () => {
        console.log(`Téléchargement annulé: ${downloadItem.filename}`);
        // Ne pas appeler erase() pour garder le téléchargement dans la liste
      });
    }
  });
});

// Met à jour le badge
function updateBadge(isEnabled) {
  chrome.action.setBadgeText({
    text: isEnabled ? 'ON' : 'OFF'
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: isEnabled ? '#FF0000' : '#888888'
  });
}

// Écoute les messages du popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleEnabled') {
    chrome.storage.local.get(['isEnabled'], (result) => {
      const newState = !result.isEnabled;
      chrome.storage.local.set({ isEnabled: newState }, () => {
        updateBadge(newState);
        sendResponse({ isEnabled: newState });
      });
    });
    return true;
  }
  
  if (request.action === 'getState') {
    chrome.storage.local.get(['isEnabled'], (result) => {
      sendResponse({ isEnabled: result.isEnabled || false });
    });
    return true;
  }
});

// Met à jour le badge au démarrage
chrome.storage.local.get(['isEnabled'], (result) => {
  updateBadge(result.isEnabled || false);
});
