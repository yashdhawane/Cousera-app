const jwt = require('jsonwebtoken');

// Middleware for authenticating admins
const adminAuthMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
      if (!decoded) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
      req.user = decoded; // Add admin data to the request object
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };

  module.exports = {
    adminAuthMiddleware,
    
  };