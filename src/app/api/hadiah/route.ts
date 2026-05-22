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
  const body = await request.json();
  // Pastikan key-nya sesuai dengan yang dikirim dari FormData
  const { kode, nama, deskripsi, id_penyedia, miles, valid_start_date, program_end } = body;
  
  try {
    await pool.query(
      "UPDATE HADIAH SET nama=$1, deskripsi=$2, id_penyedia=$3, miles=$4, valid_start_date=$5, program_end=$6 WHERE kode=$7",
      [nama, deskripsi, id_penyedia, miles, valid_start_date, program_end, kode]
    );
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, message: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const kode = url.searchParams.get("kode");
    
    if (!kode) {
      return NextResponse.json({ success: false, message: "Kode tidak ditemukan" }, { status: 400 });
    }

    const result = await pool.query("DELETE FROM HADIAH WHERE kode = $1", [kode]);
    
    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
    
  } catch (error: any) {
    console.error("DEBUG DELETE:", error); // ✅ LIHAT INI DI TERMINAL
    
    // Kalau error karena foreign key (kode 23503 di postgres)
    if (error.code === '23503') {
        return NextResponse.json({ 
            success: false, 
            message: "Hadiah tidak bisa dihapus karena sudah pernah ditukarkan member." 
        }, { status: 409 }); // 409 Conflict
    }

    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}