// Test authentication helper for development purposes
// This provides a reliable way to log in when backend services are unavailable

/**
 * Provides test account login functionality that works offline
 * @param email The email address to check
 * @param password The password to check
 * @returns Success object with auth data
 */
export const testLogin = (email: string, password: string) => {
  // Check if this is our test account
  if (email === 'test@redweb.com' && password === 'testpassword') {
    console.log('TEST ACCOUNT LOGIN ACTIVATED');
    
    // Create mock auth data
    const testToken = 'mock-jwt-token-for-testing-' + Date.now();
    const testUser = {
      id: '999',
      email: 'test@redweb.com',
      role: 'DONOR',
      name: 'Test User'
    };
    
    // Store in localStorage
    localStorage.setItem('authToken', testToken);
    localStorage.setItem('user', JSON.stringify(testUser));
    
    // Return success response
    return {
      success: true,
      accessToken: testToken,
      userId: testUser.id,
      email: testUser.email,
      role: testUser.role,
      firstName: 'Test',
      lastName: 'User'
    };
  }
  
  // Not a test account
  return {
    success: false
  };
};

/**
 * Check if test auth data is already present
 * @returns Boolean indicating if test auth is active
 */
export const isTestUserLoggedIn = () => {
  const user = localStorage.getItem('user');
  if (!user) return false;
  
  try {
    const userData = JSON.parse(user);
    return userData.email === 'test@redweb.com' && userData.id === '999';
  } catch (e) {
    return false;
  }
};

/**
 * Logout test user by clearing localStorage
 */
export const logoutTestUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};
