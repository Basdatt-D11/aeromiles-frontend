import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const claimStatsResult = await pool.query(
      "SELECT status_penerimaan, COUNT(*) as total FROM CLAIM_MISSING_MILES GROUP BY status_penerimaan"
    );

    const transferStatsResult = await pool.query(
      "SELECT SUM(jumlah) as total_miles_transferred FROM TRANSFER"
    );

    const redeemStatsResult = await pool.query(
      "SELECT kode_hadiah, COUNT(*) as total_redeem FROM REDEEM GROUP BY kode_hadiah"
    );

    return NextResponse.json({
      success: true,
      data: {
        claim_stats: claimStatsResult.rows,
        transfer_stats: transferStatsResult.rows[0],
        redeem_stats: redeemStatsResult.rows
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}