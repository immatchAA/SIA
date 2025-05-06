// Global state manager for profile picture
// This creates a central hub for profile picture data that any component can access

// Create a global variable to hold the profile picture
let globalProfilePicture: string | null = null;

// List of callback functions to be executed when the profile picture changes
const subscribers: ((profilePicture: string | null) => void)[] = [];

// Function to update the profile picture
export const setGlobalProfilePicture = (newProfilePicture: string | null): void => {
  globalProfilePicture = newProfilePicture;
  
  // Save to localStorage as backup
  if (newProfilePicture && typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('globalProfilePicture', newProfilePicture);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  // Notify all subscribers
  subscribers.forEach(callback => callback(globalProfilePicture));
  
  console.log('Global profile picture updated:', !!globalProfilePicture);
};

// Function to get the current profile picture
export const getGlobalProfilePicture = (): string | null => {
  // If we don't have a global picture yet, try to get it from localStorage
  if (!globalProfilePicture && typeof window !== 'undefined' && window.localStorage) {
    try {
      const storedPicture = localStorage.getItem('globalProfilePicture');
      if (storedPicture) {
        globalProfilePicture = storedPicture;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }
  
  return globalProfilePicture;
};

// Function to subscribe to profile picture changes
export const subscribeToProfilePicture = (callback: (profilePicture: string | null) => void): () => void => {
  subscribers.push(callback);
  
  // Immediately call with current value
  callback(globalProfilePicture);
  
  // Return unsubscribe function
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
};

// Initialize from localStorage on module load
if (typeof window !== 'undefined' && window.localStorage) { // Check if we're in browser
  try {
    const storedPicture = localStorage.getItem('globalProfilePicture');
    if (storedPicture) {
      globalProfilePicture = storedPicture;
    }
  } catch (error) {
    console.error('Error initializing from localStorage:', error);
  }
}
