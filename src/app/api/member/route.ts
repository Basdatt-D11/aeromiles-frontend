import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT m.nomor_member, m.email, p.first_mid_name, p.last_name, m.id_tier, m.total_miles, m.award_miles, m.tanggal_bergabung 
      FROM MEMBER m
      JOIN PENGGUNA p ON m.email = p.email
      ORDER BY m.tanggal_bergabung DESC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}