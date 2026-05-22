import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT m.nomor_member, m.email, p.first_mid_name, p.last_name, m.id_tier, m.total_miles, m.award_miles, m.tanggal_bergabung, p.tanggal_lahir, p.salutation, p.kewarganegaraan, p.country_code, p.mobile_number 
      FROM MEMBER m
      JOIN PENGGUNA p ON m.email = p.email
      ORDER BY m.tanggal_bergabung DESC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const client = await pool.connect();
  
  // FIX: Ubah string kosong jadi null biar gak error date
  const tgl_lahir = body.tanggal_lahir && body.tanggal_lahir !== "" ? body.tanggal_lahir : null;

  try {
    await client.query('BEGIN');
    await client.query(
      "INSERT INTO PENGGUNA (email, password, salutation, first_mid_name, last_name, kewarganegaraan, country_code, mobile_number, tanggal_lahir) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [body.email, body.password, body.salutation, body.nama_depan, body.nama_belakang, body.kewarganegaraan, body.country_code, body.nomor_hp, tgl_lahir]
    );
    await client.query(
      "INSERT INTO MEMBER (email, nomor_member, id_tier, total_miles, award_miles, tanggal_bergabung) VALUES ($1, $2, $3, $4, $5, $6)",
      [body.email, `M-${Date.now().toString().slice(-4)}`, 'T01', 0, 0, new Date()]
    );
    await client.query('COMMIT');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const tgl_lahir = body.tanggal_lahir && body.tanggal_lahir !== "" ? body.tanggal_lahir : null;
  
  try {
    await pool.query(
      "UPDATE PENGGUNA SET salutation=$1, first_mid_name=$2, last_name=$3, kewarganegaraan=$4, country_code=$5, mobile_number=$6, tanggal_lahir=$7 WHERE email=$8",
      [body.salutation, body.nama_depan, body.nama_belakang, body.kewarganegaraan, body.country_code, body.nomor_hp, tgl_lahir, body.email]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const nomor_member = searchParams.get("nomor_member");
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const res = await client.query("SELECT email FROM MEMBER WHERE nomor_member = $1", [nomor_member]);
    if (res.rows.length > 0) {
      const email = res.rows[0].email;
      await client.query("DELETE FROM MEMBER WHERE nomor_member = $1", [nomor_member]);
      await client.query("DELETE FROM PENGGUNA WHERE email = $1", [email]);
    }
    await client.query('COMMIT');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}