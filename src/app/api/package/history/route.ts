import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  try {
    const result = await pool.query(
      `SELECT mamp.*, amp.jumlah_award_miles as jumlah_miles 
       FROM MEMBER_AWARD_MILES_PACKAGE mamp
       JOIN AWARD_MILES_PACKAGE amp ON mamp.id_award_miles_package = amp.id
       WHERE mamp.email_member = $1
       ORDER BY mamp.timestamp DESC`,
      [email]
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}