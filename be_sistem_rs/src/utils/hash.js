import bcrypt from 'bcrypt';

export const comparePassword = (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};
