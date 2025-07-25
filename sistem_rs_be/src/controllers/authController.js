import { findUserByEmail } from '../models/authModel.js';
import { generateToken } from '../utils/jwt.js';
import { loginSchema } from '../schemas/authSchema.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await findUserByEmail(email.trim());

    if (!user || user.PASSWORD !== password.trim()) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = await generateToken({
      id: user.IDTENAGAMEDIS || user.IDTENAGANONMEDIS, 
      role: user.ROLE,
      email: user.EMAIL,
      sumber: user.IDTENAGAMEDIS ? 'medis' : 'non_medis' 
    });

    res.status(200).json({
      token,
      username: user.USERNAME,
      email: user.EMAIL,
      role: user.ROLE
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};