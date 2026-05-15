import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    let query = "SELECT * FROM IDENTITAS";
    let params: any[] = [];

    if (email) {
      query = "SELECT * FROM IDENTITAS WHERE email_member = $1";
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
    const { nomor, email_member, tanggal_habis, tanggal_terbit, negara_penerbit, jenis } = body;

    await pool.query(
      `INSERT INTO IDENTITAS (nomor, email_member, tanggal_habis, tanggal_terbit, negara_penerbit, jenis) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [nomor, email_member, tanggal_habis, tanggal_terbit, negara_penerbit, jenis]
    );

    return NextResponse.json({ success: true, message: "Identitas berhasil ditambahkan!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { nomor, tanggal_habis, tanggal_terbit, negara_penerbit, jenis } = body;

    const result = await pool.query(
      `UPDATE IDENTITAS 
       SET tanggal_habis = $1, tanggal_terbit = $2, negara_penerbit = $3, jenis = $4 
       WHERE nomor = $5`,
      [tanggal_habis, tanggal_terbit, negara_penerbit, jenis, nomor]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Identitas tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Identitas berhasil diperbarui!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const nomor = url.searchParams.get("nomor");

    if (!nomor) {
      return NextResponse.json({ success: false, message: "Nomor identitas diperlukan" }, { status: 400 });
    }

    const result = await pool.query("DELETE FROM IDENTITAS WHERE nomor = $1", [nomor]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Identitas tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Identitas berhasil dihapus!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}