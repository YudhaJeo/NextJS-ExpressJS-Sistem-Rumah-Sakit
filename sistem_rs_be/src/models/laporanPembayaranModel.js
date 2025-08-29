import db from "../core/config/knex.js";

export const getAll = ({ startDate, endDate, nik, metode }) => {
    let query = db("invoice as i")
        .leftJoin("pembayaran as p", "i.IDINVOICE", "p.IDINVOICE")
        .leftJoin("deposit_penggunaan as dp", "i.IDINVOICE", "dp.IDINVOICE")
        .leftJoin("angsuran as a", "i.IDINVOICE", "a.IDINVOICE")
        .leftJoin("pasien as ps", "i.NIK", "ps.NIK")
        .leftJoin("asuransi as asr", "ps.IDASURANSI", "asr.IDASURANSI")
        .select(
            "i.IDINVOICE",
            "i.NOINVOICE",
            "i.TANGGALINVOICE",
            "i.TOTALTAGIHAN",
            "i.SISA_TAGIHAN",
            "i.STATUS",
            "i.NIK",
            "ps.NAMALENGKAP as NAMAPASIEN",
            "asr.NAMAASURANSI as ASURANSI",
            db.raw("IFNULL(SUM(DISTINCT p.JUMLAHBAYAR),0) as TOTALPEMBAYARAN"), // ✅ hindari duplikat
            db.raw("IFNULL(SUM(DISTINCT dp.JUMLAH_PEMAKAIAN),0) as TOTALDEPOSIT"),
            db.raw("IFNULL(SUM(DISTINCT a.NOMINAL),0) as TOTALANGSURAN"),
            db.raw("MAX(p.METODEPEMBAYARAN) as METODEPEMBAYARAN")
        )
        .where("i.STATUS", "LUNAS")
        .groupBy(
            "i.IDINVOICE",
            "i.NOINVOICE",
            "i.TANGGALINVOICE",
            "i.TOTALTAGIHAN",
            "i.SISA_TAGIHAN",
            "i.STATUS",
            "i.NIK",
            "ps.NAMALENGKAP",
            "asr.NAMAASURANSI"
        );

    if (startDate && endDate) {
        query.whereBetween("i.TANGGALINVOICE", [startDate, endDate]);
    }

    if (nik) {
        query.where("i.NIK", nik);
    }

    if (metode) {
        query.andWhere((builder) => {
            builder.where("p.METODEPEMBAYARAN", metode).orWhere("a.METODE", metode);
        });
    }

    return query;
};