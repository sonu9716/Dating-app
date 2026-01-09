const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET is not set in environment variables! Auth will fail.');
}
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '30d';

exports.JWT_SECRET = JWT_SECRET;

exports.generateToken = (userId, expiresIn = JWT_EXPIRY) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn }
  );
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRY }
  );
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token: ' + err.message);
  }
};

exports.decodeToken = (token) => {
  return jwt.decode(token);
};
