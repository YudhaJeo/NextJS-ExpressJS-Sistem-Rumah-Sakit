'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelPenjualan from './components/tabelPenjualan';
import FormPenjualan from './components/formPenjualan';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PagePenjualan = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/order_pengambilan?status=MENUNGGU`);
      setOrders(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleProses = (order) => {
    setSelectedOrder(order);
    setDialogVisible(true);
  };

  const handleSubmitPenjualan = async (formData) => {
    await axios.post(`${API_URL}/penjualan`, formData);
    setDialogVisible(false);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="card">
      <HeaderBar title="Penjualan Obat" placeholder="Cari Order..." />

      <TabelPenjualan
        data={orders}
        loading={loading}
        onProses={handleProses}
      />

      <FormPenjualan
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        data={selectedOrder}
        onSubmit={handleSubmitPenjualan}
      />
    </div>
  );
};

export default PagePenjualan;