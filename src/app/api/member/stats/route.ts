import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
        return NextResponse.json({ success: false, message: "Email dibutuhkan" }, { status: 400 });
    }

    const result = await pool.query(`
      SELECT m.nomor_member, m.id_tier, m.total_miles, m.award_miles, t.nama as nama_tier 
      FROM MEMBER m
      JOIN TIER t ON m.id_tier = t.id_tier
      WHERE m.email = $1
    `, [email]);

    if (result.rows.length === 0) {
        return NextResponse.json({ success: false, message: "Member tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}