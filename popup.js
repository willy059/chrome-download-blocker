const toggleBtn = document.getElementById('toggleBtn');
const status = document.getElementById('status');

// Charge l'état initial
chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
  updateUI(response.isEnabled);
});

// Gère le clic sur le bouton
toggleBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'toggleEnabled' }, (response) => {
    updateUI(response.isEnabled);
  });
});

// Met à jour l'interface
function updateUI(isEnabled) {
  if (isEnabled) {
    toggleBtn.textContent = 'ON';
    toggleBtn.className = 'toggle-btn on';
    status.textContent = '🚫 Les téléchargements sont bloqués';
    status.style.color = '#ff4757';
  } else {
    toggleBtn.textContent = 'OFF';
    toggleBtn.className = 'toggle-btn off';
    status.textContent = '✓ Les téléchargements sont autorisés';
    status.style.color = '#2ecc71';
  }
}
