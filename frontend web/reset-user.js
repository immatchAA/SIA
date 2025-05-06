// Reset user script for RedWeb
// This script will clear localStorage and set up a new user with zero donations

// Clear all localStorage
localStorage.clear();

// Create a new user with isNewUser flag
const newUser = {
  id: 'local-' + Date.now(),
  email: 'new@redweb.com',
  name: 'New User',
  role: 'DONOR',
  isNewUser: true,
  createdAt: new Date().toISOString()
};

// Store the user
localStorage.setItem('user', JSON.stringify(newUser));
localStorage.setItem('authToken', 'local-token-' + Date.now());

// Set empty donation history
localStorage.setItem(`donation_history_${newUser.id}`, JSON.stringify([]));

// Force refresh
window.location.reload();

console.log('User data reset to new user state');
