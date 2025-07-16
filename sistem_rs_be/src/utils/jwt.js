import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'defaultSecretKey');

export const generateToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS512' })
    .setIssuedAt()
    .setExpirationTime('1d') // expired dalam 1 hari
    .sign(secret);
};
