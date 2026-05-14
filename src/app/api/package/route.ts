import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, id_package } = await req.json();
    await pool.query(
      "INSERT INTO MEMBER_AWARD_MILES_PACKAGE (email_member, id_award_miles_package) VALUES ($1, $2)",
      [email, id_package]
    );
    return NextResponse.json({ message: "Pembelian Berhasil!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}