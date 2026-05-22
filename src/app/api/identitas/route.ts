import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    let query = `
      SELECT *, 
        CASE 
          WHEN tgl_habis >= CURRENT_DATE THEN 'Aktif'
          ELSE 'Tidak Aktif'
        END as status 
      FROM IDENTITAS
    `;
    let params: any[] = [];

    if (email) {
      query = `
        SELECT i.*, 
          CASE 
            WHEN i.tgl_habis >= CURRENT_DATE THEN 'Aktif'
            ELSE 'Tidak Aktif'
          END as status 
        FROM IDENTITAS i
        JOIN MEMBER m ON i.nomor_member = m.nomor_member
        WHERE m.email = $1
      `;
      params = [email];
    }

    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error("Error in GET /api/identitas:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { no_dokumen, jenis, negara, tgl_terbit, tgl_habis, nomor_member } = body;
    console.log("PAYLOAD DITERIMA:", body);

    // Tambahin pengecekan biar gak kosong
    if (!nomor_member) {
      return NextResponse.json({ success: false, message: "Nomor member tidak ditemukan!" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO IDENTITAS (no_dokumen, nomor_member, tgl_habis, tgl_terbit, negara, jenis, status) 
      VALUES ($1, $2, $3, $4, $5, $6, 'Aktif')`,
      [no_dokumen, nomor_member, tgl_habis, tgl_terbit, negara, jenis]
    );

    return NextResponse.json({ success: true, message: "Identitas berhasil ditambahkan!" }, { status: 201 });
  } catch (error: any) {
    console.error("Error POST:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { no_dokumen, tgl_habis, tgl_terbit, negara, jenis } = body;

    const result = await pool.query(
      `UPDATE IDENTITAS 
       SET tgl_habis = $1, tgl_terbit = $2, negara = $3, jenis = $4 
       WHERE no_dokumen = $5`,
      [tgl_habis, tgl_terbit, negara, jenis, no_dokumen]
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
    const no_dokumen = url.searchParams.get("no_dokumen");

    if (!no_dokumen) {
      return NextResponse.json({ success: false, message: "Nomor identitas diperlukan" }, { status: 400 });
    }

    const result = await pool.query("DELETE FROM IDENTITAS WHERE no_dokumen = $1", [no_dokumen]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Identitas tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Identitas berhasil dihapus!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}