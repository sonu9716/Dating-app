const jwt = require('jsonwebtoken');

exports.generateToken = (userId, expiresIn = process.env.JWT_EXPIRY) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY }
  );
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token: ' + err.message);
  }
};

exports.decodeToken = (token) => {
  return jwt.decode(token);
};
