import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
    }

    // Attach userId to request object – NOT to req.body – to prevent user tampering
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Auth error:`, error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }

    return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
  }
};

export default authUser;