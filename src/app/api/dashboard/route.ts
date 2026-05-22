import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ success: false }, { status: 400 });

    // 1. Tarik Data Utama (JOIN 3 Tabel)
    const userResult = await pool.query(`
      SELECT p.*, m.nomor_member, m.award_miles, m.total_miles, m.tanggal_bergabung, t.nama as nama_tier
      FROM PENGGUNA p
      LEFT JOIN MEMBER m ON p.email = m.email
      LEFT JOIN TIER t ON m.id_tier = t.id_tier
      WHERE p.email = $1
    `, [email]);

    // 2. Tarik 5 Riwayat Transaksi Terakhir
    const transResult = await pool.query(`
      SELECT transfer_timestamp as waktu, 'Transfer' as tipe, catatan,
             CASE WHEN email_member_1 = $1 THEN -jumlah ELSE jumlah END as miles
      FROM TRANSFER 
      WHERE email_member_1 = $1 OR email_member_2 = $1
      ORDER BY transfer_timestamp DESC
      LIMIT 5
    `, [email]);

    return NextResponse.json({
      success: true,
      user: userResult.rows[0],
      transactions: transResult.rows
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}