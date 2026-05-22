import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    console.log("HASIL GET DARI DB:", result.rows);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("1. DATA DARI FRONTEND:", body); // Cek apakah ada data yang undefined/kosong

    const { email_member, maskapai, bandara_asal, bandara_tujuan, tanggal_penerbangan, flight_number, nomor_tiket, kelas_kabin, pnr } = body;

    // ✅ Tambahin "RETURNING *" di akhir query biar ketahuan data masuk atau mental
    const result = await pool.query(
      `INSERT INTO CLAIM_MISSING_MILES 
      (email_member, maskapai, bandara_asal, bandara_tujuan, tanggal_penerbangan, flight_number, nomor_tiket, kelas_kabin, pnr, status_penerimaan, timestamp) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Menunggu', CURRENT_TIMESTAMP)
      RETURNING *`, // <--- INI KUNCI INTELNYA
      [email_member, maskapai, bandara_asal, bandara_tujuan, tanggal_penerbangan, flight_number, nomor_tiket, kelas_kabin, pnr]
    );
    
    if (result.rowCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Insert diam-diam digagalkan oleh Trigger di Database!" 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Klaim berhasil diajukan" }, { status: 201 });
  } catch (error: any) {
    console.error("ERROR POST KLAIM:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// FUNGSI BARU: UPDATE (EDIT)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_klaim, maskapai, bandara_asal, bandara_tujuan, tanggal_penerbangan, flight_number, nomor_tiket, kelas_kabin, pnr } = body;

    await pool.query(
      `UPDATE CLAIM_MISSING_MILES 
       SET maskapai=$1, bandara_asal=$2, bandara_tujuan=$3, tanggal_penerbangan=$4, 
           flight_number=$5, nomor_tiket=$6, kelas_kabin=$7, pnr=$8
       WHERE id_klaim = $9 AND status_penerimaan = 'Menunggu'`,
      [maskapai, bandara_asal, bandara_tujuan, tanggal_penerbangan, flight_number, nomor_tiket, kelas_kabin, pnr, id_klaim]
    );

    return NextResponse.json({ success: true, message: "Klaim berhasil diupdate" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// FUNGSI BARU: DELETE (HAPUS)
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    await pool.query("DELETE FROM CLAIM_MISSING_MILES WHERE id = $1 AND status_penerimaan = 'Menunggu'", [id]);
    return NextResponse.json({ success: true, message: "Klaim berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}