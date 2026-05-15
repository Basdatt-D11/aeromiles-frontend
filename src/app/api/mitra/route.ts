import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM MITRA ORDER BY tanggal_kerja_sama DESC");
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email_mitra, id_penyedia, nama_mitra, tanggal_kerja_sama } = body;
    
    await pool.query(
      "INSERT INTO MITRA (email_mitra, id_penyedia, nama_mitra, tanggal_kerja_sama) VALUES ($1, $2, $3, $4)",
      [email_mitra, id_penyedia, nama_mitra, tanggal_kerja_sama]
    );
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email_mitra, id_penyedia, nama_mitra, tanggal_kerja_sama } = body;
    
    await pool.query(
      "UPDATE MITRA SET id_penyedia = $1, nama_mitra = $2, tanggal_kerja_sama = $3 WHERE email_mitra = $4",
      [id_penyedia, nama_mitra, tanggal_kerja_sama, email_mitra]
    );
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const email_mitra = url.searchParams.get("email");
    
    await pool.query("DELETE FROM MITRA WHERE email_mitra = $1", [email_mitra]);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}