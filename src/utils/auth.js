/**
 * auth.js - Secure Admin Authentication utilities
 * Implements client-side SHA-256 hashing for password comparison against the environment hash,
 * and handles secure local session token storage with a 24-hour expiration check.
 */

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Validates the password by hashing it and comparing to the environment secret hash.
 * If valid, establishes a session in sessionStorage valid for 24 hours.
 * @param {string} password - The plain-text password input.
 * @returns {Promise<boolean>} - True if authenticated successfully, false otherwise.
 */
export async function loginAdmin(password) {
  const hash = await sha256(password);
  // Fallback to the target hash if env variable is somehow missing
  const targetHash = process.env.REACT_APP_ADMIN_HASH || 'bad5d8b0d3eb9eeafe6b9a8293c4da5854d49b3342d29c19be854166e83db179';
  
  if (hash === targetHash) {
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const session = {
      token: 'arup_admin_token_' + Math.random().toString(36).substring(2, 15),
      expiry: expiryTime
    };
    sessionStorage.setItem('admin_session', JSON.stringify(session));
    return true;
  }
  return false;
}

/**
 * Destroys the admin session token.
 */
export function logoutAdmin() {
  sessionStorage.removeItem('admin_session');
}

/**
 * Checks if the current admin session is valid and has not expired.
 * @returns {boolean} - True if authenticated, false otherwise.
 */
export function isAdminAuthenticated() {
  try {
    const sessionStr = sessionStorage.getItem('admin_session');
    if (!sessionStr) return false;
    
    const session = JSON.parse(sessionStr);
    if (!session || !session.expiry || !session.token) {
      sessionStorage.removeItem('admin_session');
      return false;
    }
    
    if (Date.now() > session.expiry) {
      sessionStorage.removeItem('admin_session');
      return false;
    }
    
    return true;
  } catch (error) {
    sessionStorage.removeItem('admin_session');
    return false;
  }
}
