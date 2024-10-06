const jwt = require('jsonwebtoken');

// Middleware for authenticating users
const userAuthMiddleware = (req, res, next) => {
  // Get token from headers
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);
    req.user = decoded; // Add user data to the request object
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};



module.exports = {
  userAuthMiddleware,
  
};
