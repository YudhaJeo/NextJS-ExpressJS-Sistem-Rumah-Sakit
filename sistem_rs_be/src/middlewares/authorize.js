// \middlewares\authorize.js
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      return res.status(403).json({ message: "Akses ditolak: user tidak ditemukan." });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: `Akses ditolak: hanya untuk ${allowedRoles.join(', ')}` });
    }

    next();
  };
};
