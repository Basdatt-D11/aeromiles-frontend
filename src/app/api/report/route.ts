import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Ambil Claim Stats
    const claimStatsResult = await pool.query("SELECT status_penerimaan, COUNT(*) as total FROM CLAIM_MISSING_MILES GROUP BY status_penerimaan");
    
    // 2. Ambil Transfer Stats
    const transferStatsResult = await pool.query("SELECT SUM(jumlah) as total_miles_transferred FROM TRANSFER");
    
    // 3. Ambil Redeem Stats
    const redeemStatsResult = await pool.query("SELECT kode_hadiah, COUNT(*) as total_redeem FROM REDEEM GROUP BY kode_hadiah");

    // 4. TRANSAKSI DETAIL (Seringkali ini yang bikin error kalau nama kolom salah)
    // Pastikan nama kolom 'email_member' atau 'email_pengirim' SESUAI dengan database kamu!
    const transactionsResult = await pool.query(`
      SELECT 
        'Klaim' as tipe, 
        email_member as email, 
        1000 as miles, 
        timestamp as waktu 
      FROM CLAIM_MISSING_MILES
      UNION ALL
      SELECT 
        'Transfer' as tipe, 
        email_member_1 as email, 
        jumlah * -1 as miles, 
        transfer_timestamp as waktu 
      FROM TRANSFER
      ORDER BY waktu DESC LIMIT 20
    `);

    return NextResponse.json({
      success: true,
      data: {
        claim_stats: claimStatsResult.rows,
        transfer_stats: transferStatsResult.rows[0],
        redeem_stats: redeemStatsResult.rows,
        transactions: transactionsResult.rows
      }
    });
  } catch (error: any) {
    console.error("DEBUG REPORT ERROR:", error.message); // <--- LIHAT INI DI TERMINAL
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const waktu = searchParams.get("waktu");
  const tipe = searchParams.get("tipe");

  if (tipe === 'Transfer') {
    // Hapus dari tabel TRANSFER
    await pool.query("DELETE FROM TRANSFER WHERE email_member_1 = $1 AND transfer_timestamp = $2", [email, waktu]);
  } else if (tipe === 'Klaim') {
    // Hapus dari tabel CLAIM_MISSING_MILES
    await pool.query("DELETE FROM CLAIM_MISSING_MILES WHERE email_member = $1 AND timestamp = $2", [email, waktu]);
  }
  return NextResponse.json({ success: true });
}