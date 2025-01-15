export const isExpired = (token) => {
  try {
    // Decode the JWT token payload (assumes it's a JWT)
    const decoded = JSON.parse(atob(token.split('.')[1])); 

    // Extract the expiry time from the token and convert it to milliseconds
    const expiryTime = decoded.exp * 1000; 

    // Compare the current time with the token's expiry time
    return Date.now() > expiryTime; 
  } catch (error) {
    // Treat the token as expired if decoding fails or the token is invalid
    return true; 
  }
};
