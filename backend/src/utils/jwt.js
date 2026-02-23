import jwt from 'jsonwebtoken';

const generateToken = (id, remember = false) => {
  const expire = remember ? process.env.JWT_REMEMBER_EXPIRE || '30d' : process.env.JWT_EXPIRE || '7d';
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: expire });
};

export default generateToken;
