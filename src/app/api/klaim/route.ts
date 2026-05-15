import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    
    let query = "SELECT * FROM CLAIM_MISSING_MILES ORDER BY timestamp DESC";
    let params: any[] = [];

    if (email) {
      query = "SELECT * FROM CLAIM_MISSING_MILES WHERE email_member = $1 ORDER BY timestamp DESC";
      params = [email];
    }

    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email_member, maskapai, bandara_asal, bandara_tujuan, tanggal_penerbangan, flight_number, nomor_tiket, kelas_kabin, pnr } = body;

    await pool.query(
      `INSERT INTO CLAIM_MISSING_MILES 
      (email_member, maskapai, bandara_asal, bandara_tujuan, tanggal_penerbangan, flight_number, nomor_tiket, kelas_kabin, pnr, status_penerimaan, timestamp) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Menunggu', CURRENT_TIMESTAMP)`,
      [email_member, maskapai, bandara_asal, bandara_tujuan, tanggal_penerbangan, flight_number, nomor_tiket, kelas_kabin, pnr]
    );

    return NextResponse.json({ success: true, message: "Klaim berhasil diajukan" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message.replace("ERROR: ", "") }, { status: 400 });
  }
}