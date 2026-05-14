import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email_member, kode_hadiah } = await request.json();
    await pool.query(
      "INSERT INTO REDEEM (email_member, kode_hadiah, timestamp) VALUES ($1, $2, NOW())",
      [email_member, kode_hadiah]
    );

    return NextResponse.json({ message: "Redeem Berhasil!" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}