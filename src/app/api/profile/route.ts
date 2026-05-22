import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { email, salutation, first_mid_name, last_name, kewarganegaraan, country_code, mobile_number, tanggal_lahir, role, kode_maskapai } = body;

    await client.query('BEGIN');

    // 1. Update Tabel PENGGUNA
    await client.query(
      `UPDATE PENGGUNA 
       SET salutation=$1, first_mid_name=$2, last_name=$3, kewarganegaraan=$4, country_code=$5, mobile_number=$6, tanggal_lahir=$7 
       WHERE email=$8`,
      [salutation, first_mid_name, last_name, kewarganegaraan, country_code, mobile_number, tanggal_lahir, email]
    );

    // 2. Update Tabel STAFF (kalau rolenya STAFF)
    if (role === 'STAFF') {
      // Pake ON CONFLICT biar gak error kalau data staf belum ada
      await client.query(
        `INSERT INTO staf (email, id_staf, kode_maskapai) 
        VALUES ($1, 'STF' || LPAD(nextval('staf_seq')::text, 3, '0'), $2)
        ON CONFLICT (email) DO UPDATE SET kode_maskapai = EXCLUDED.kode_maskapai`,
        [email, kode_maskapai]
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error("DEBUG ERROR BACKEND:", error); // ✅ LIHAT INI DI TERMINAL VS CODE LU!
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}