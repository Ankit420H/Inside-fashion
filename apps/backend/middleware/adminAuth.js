import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify the token contains admin role and correct email
    if (decoded?.role !== 'admin' || decoded?.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Admin auth error:`, error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }

    return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
  }
};

export default adminAuth;