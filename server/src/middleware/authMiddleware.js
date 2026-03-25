import jwt from 'jsonwebtoken'
import User from '../model/userModel.js'

// Verify JWT token - required auth
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Access denied. Please log in.' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    next(err);
  }
};

// Optional auth - attaches user if token present but doesn't block
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select('-password');
      req.user = user || null;
    } else {
      req.user = null;
    }

    next();
  } catch {
    req.user = null;
    next();
  }
};

// Check if the authenticated user owns the resource
const isOwner = (paramField = 'username') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // Compare by username or by id
    const paramValue = req.params[paramField];
    if (paramValue && req.user.username !== paramValue && req.user._id.toString() !== paramValue) {
      return res.status(403).json({ error: 'Forbidden. You do not own this resource.' });
    }

    next();
  };
};

export { protect, optionalAuth, isOwner };