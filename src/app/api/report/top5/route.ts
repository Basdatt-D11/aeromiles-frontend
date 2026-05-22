import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Menjalankan fungsi SQL yang melempar Exception
    await pool.query('SELECT get_top_5_members_message()');
    
    // Kode ini secara teknis tidak akan pernah tercapai jika fungsi selalu melempar Exception
    return NextResponse.json({ success: true, message: "Report generated" });
  } catch (error: any) {
    // Mengecek apakah pesan error sebenarnya adalah pesan sukses dari dosen
    if (error.message && error.message.includes("SUKSES:")) {
      return NextResponse.json({ 
        success: true, 
        message: error.message.replace("ERROR: ", "") 
      }, { status: 200 });
    }

    // Jika error asli/bukan pesan sukses custom
    console.error("Database Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Terjadi kesalahan pada server" 
    }, { status: 500 });
  }
}
