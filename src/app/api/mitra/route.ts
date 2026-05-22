import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Sesuaikan order by dengan kolom yang ada di database lu
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
    const { email, nama, tanggal_kerja_sama, id_penyedia } = body;

    await client.query('BEGIN');

    // Cek apakah ID Penyedia ada?
    const checkPenyedia = await client.query("SELECT id FROM PENYEDIA WHERE id = $1", [id_penyedia]);
    if (checkPenyedia.rows.length === 0) {
      throw new Error(`ID Penyedia ${id_penyedia} tidak terdaftar. Pastikan ID tersebut ada di tabel PENYEDIA.`);
    }

    await client.query(
      "INSERT INTO MITRA (email, nama, tanggal_kerja_sama, id_penyedia) VALUES ($1, $2, $3, $4)",
      [email, nama, tanggal_kerja_sama, id_penyedia]
    );

    await client.query('COMMIT');
    return NextResponse.json({ success: true });
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
    const { email, nama, tanggal_kerja_sama, id_penyedia } = body;

    // Cek apakah ID Penyedia ada sebelum update
    const checkPenyedia = await pool.query("SELECT id FROM PENYEDIA WHERE id = $1", [id_penyedia]);
    if (checkPenyedia.rows.length === 0) {
      return NextResponse.json({ success: false, message: "ID Penyedia tidak valid!" }, { status: 400 });
    }
    
    await pool.query(
      "UPDATE MITRA SET nama = $1, tanggal_kerja_sama = $2, id_penyedia = $3 WHERE email = $4",
      [nama, tanggal_kerja_sama, id_penyedia, email]
    );
    
    return NextResponse.json({ success: true });
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