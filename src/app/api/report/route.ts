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
        id as id,
        email_member as email, 
        1000 as miles, 
        timestamp as waktu 
      FROM claim_missing_miles
      UNION ALL
      SELECT 
        'Transfer' as tipe,
        NULL as id,
        email_member_1 as email, 
        jumlah * -1 as miles, 
        transfer_timestamp as waktu
      FROM transfer
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
  const email2 = searchParams.get("email2"); // untuk transfer

  try {
    if (tipe === 'Transfer') {
      await pool.query(
        "DELETE FROM transfer WHERE email_member_1 = $1 AND transfer_timestamp = $2",
        [email, waktu]
      );
    } else if (tipe === 'Klaim') {
      await pool.query(
        "DELETE FROM claim_missing_miles WHERE id = $1",
        [searchParams.get("id")]
      );
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

