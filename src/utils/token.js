import jwt from 'jsonwebtoken';

export const generateToken = (payload, expiresIn = '24h') => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};