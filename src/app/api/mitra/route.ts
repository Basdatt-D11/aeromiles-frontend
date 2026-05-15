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
  const client = await pool.connect();
  try {
    const body = await request.json();
    // Destructuring sesuai name attribute di form frontend
    const { email_mitra, nama_mitra, tanggal_kerja_sama } = body;

    await client.query('BEGIN');

    const penyediaResult = await client.query(
      "INSERT INTO PENYEDIA DEFAULT VALUES RETURNING id"
    );
    const idPenyedia = penyediaResult.rows[0].id;

    // Mapping: email_mitra -> kolom email, nama_mitra -> kolom nama
    await client.query(
      "INSERT INTO MITRA (email, nama, tanggal_kerja_sama, id_penyedia) VALUES ($1, $2, $3, $4)",
      [email_mitra, nama_mitra, tanggal_kerja_sama, idPenyedia]
    );

    await client.query('COMMIT');
    return NextResponse.json({ success: true, message: "Mitra berhasil didaftarkan!" }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  } finally {
    client.release();
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email_mitra, nama_mitra, tanggal_kerja_sama } = body;
    
    await pool.query(
      "UPDATE MITRA SET nama = $1, tanggal_kerja_sama = $2 WHERE email = $3",
      [nama_mitra, tanggal_kerja_sama, email_mitra]
    );
    
    return NextResponse.json({ success: true, message: "Data mitra diperbarui!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    
    await pool.query("DELETE FROM MITRA WHERE email = $1", [email]);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}