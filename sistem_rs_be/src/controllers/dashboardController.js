import { getDashboardInfo } from '../models/dashboardModel.js';

export const getDashboardData = async (req, res) => {
  try {
    const result = await getDashboardInfo();
    res.json(result);
  } catch (error) {
    console.error("Dashboard Error:", error);
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: 'Gagal mengambil data dashboard' });
  }
};