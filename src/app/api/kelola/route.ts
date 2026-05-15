import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status_penerimaan, email_staf } = body;

    await pool.query(
      "UPDATE CLAIM_MISSING_MILES SET status_penerimaan = $1, email_staf = $2 WHERE id = $3",
      [status_penerimaan, email_staf, id]
    );

    return NextResponse.json({ success: true, message: "Status klaim diperbarui" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}