import * as PendaftaranModel from '../models/pendaftaranModel.js';
import * as RawatJalanModel from '../models/rawatJalanModel.js';
import { generateNoInvoice } from '../utils/generateNoInvoice.js';
import db from '../core/config/knex.js';

export async function createPendaftaran(req, res) {
  const trx = await db.transaction();
  try {
    const { NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN } = req.body;

    if (!NIK || !TANGGALKUNJUNGAN || !IDPOLI) {
      await trx.rollback();
      return res.status(400).json({ message: 'NIK, TANGGALKUNJUNGAN, dan IDPOLI wajib diisi' });
    }

    const dokter = await trx('dokter').where({ IDPOLI }).orderBy('IDDOKTER').first();
    if (!dokter) {
      await trx.rollback();
      return res.status(400).json({
        message: 'Tidak ada dokter di poli ini. Pendaftaran tidak bisa disimpan.',
      });
    }

    const [idPendaftaran] = await trx('pendaftaran').insert(
      {
        NIK,
        TANGGALKUNJUNGAN,
        IDPOLI,
        KELUHAN: KELUHAN || null,
        STATUSKUNJUNGAN: STATUSKUNJUNGAN || 'Dalam Antrian',
      }
    );
    const insertedId = typeof idPendaftaran === 'object' ? idPendaftaran.IDPENDAFTARAN : idPendaftaran;

    await RawatJalanModel.createRawatJalan(
      {
        IDPENDAFTARAN: insertedId,
        IDDOKTER: dokter.IDDOKTER,
        STATUSKUNJUNGAN: STATUSKUNJUNGAN || 'Dalam Antrian',
        STATUSRAWAT: 'Rawat Jalan',
        DIAGNOSA: '',
        OBAT: '',
      },
      trx
    );

    const pasien = await trx('pasien').where({ NIK }).first();
    if (!pasien) {
      throw new Error('Pasien tidak ditemukan untuk pembuatan invoice.');
    }

    const tanggalInvoice = new Date().toISOString().split('T')[0];
    const NOINVOICE = await generateNoInvoice(tanggalInvoice, trx);

    await trx('invoice').insert({
      NOINVOICE,
      NIK,
      IDASURANSI: pasien.IDASURANSI || null,
      TANGGALINVOICE: tanggalInvoice,
      TOTALTAGIHAN: 0,
      STATUS: 'BELUM_LUNAS',
    });

    await trx.commit();
    res.status(201).json({ message: 'Pendaftaran, Rawat Jalan, dan Invoice berhasil dibuat.' });
  } catch (err) {
    await trx.rollback();
    console.error('❌ Gagal membuat data:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function getAllPendaftaran(req, res) {
  try {
    const data = await PendaftaranModel.getAll();
    res.json({ data });
  } catch (err) {
    console.error('GetAll Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function updatePendaftaran(req, res) {
  const trx = await db.transaction();
  try {
    const { id } = req.params;
    const { NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN } = req.body;

    await trx('pendaftaran')
      .where({ IDPENDAFTARAN: id })
      .update({
        NIK,
        TANGGALKUNJUNGAN,
        IDPOLI,
        KELUHAN: KELUHAN || null,
        STATUSKUNJUNGAN,
        UPDATED_AT: db.fn.now(),
      });

    await trx('rawat_jalan').where({ IDPENDAFTARAN: id }).update({
      STATUSKUNJUNGAN,
    });

    await trx.commit();
    res.json({ message: 'Pendaftaran berhasil diperbarui' });
  } catch (err) {
    await trx.rollback();
    console.error('Update Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function deletePendaftaran(req, res) {
  try {
    const { id } = req.params;
    await PendaftaranModel.remove(id);
    res.json({ message: 'Pendaftaran berhasil dihapus' });
  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}