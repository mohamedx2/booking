const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  // Check if the Authorization header exists
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
  }

  // Verify the token
  try {
    const decoded =await jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded payload:', decoded); // Log the decoded payload for debugging

    // Ensure the user object exists in the decoded payload
    if (!decoded) {
      return res.status(401).json({ msg: 'Token non valide: utilisateur manquant' });
    }

    req.user = decoded;
    console.log('User from token:', req.user); // Log the user object for debugging
    next();
  } catch (err) {
    console.error('Token verification error:', err); // Log the error for debugging
    res.status(401).json({ msg: 'Token non valide' });
  }
};
