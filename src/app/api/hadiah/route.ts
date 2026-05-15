import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM HADIAH");
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, miles, deskripsi, valid_start_date, program_end, id_penyedia } = body;
    
    await pool.query(
      `INSERT INTO HADIAH (nama, miles, deskripsi, valid_start_date, program_end, id_penyedia) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [nama, miles, deskripsi, valid_start_date, program_end, id_penyedia]
    );
    
    return NextResponse.json({ success: true, message: "Hadiah berhasil ditambahkan!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    // Destructuring menggunakan kode_hadiah sesuai frontend
    const { kode_hadiah, nama, miles, deskripsi, valid_start_date, program_end, id_penyedia } = body;
    
    await pool.query(
      `UPDATE HADIAH SET nama = $1, miles = $2, deskripsi = $3, valid_start_date = $4, 
       program_end = $5, id_penyedia = $6 WHERE kode = $7`,
      [nama, miles, deskripsi, valid_start_date, program_end, id_penyedia, kode_hadiah]
    );
    
    return NextResponse.json({ success: true, message: "Hadiah berhasil diperbarui!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const kode = url.searchParams.get("kode");
    
    await pool.query("DELETE FROM HADIAH WHERE kode = $1", [kode]);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}