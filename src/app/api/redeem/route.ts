import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { email_member, kode_hadiah } = await request.json();

    await client.query('BEGIN');

    const hadiahRes = await client.query(
      "SELECT miles FROM HADIAH WHERE kode_hadiah = $1",
      [kode_hadiah]
    );

    if (hadiahRes.rows.length === 0) {
      throw new Error("Hadiah tidak ditemukan");
    }

    const harga_miles = hadiahRes.rows[0].miles;

    const memberRes = await client.query(
      "SELECT award_miles FROM MEMBER WHERE email = $1 FOR UPDATE",
      [email_member]
    );

    if (memberRes.rows.length === 0) {
      throw new Error("Member tidak ditemukan");
    }

    const current_miles = memberRes.rows[0].award_miles;

    if (current_miles < harga_miles) {
      throw new Error("Award miles tidak mencukupi");
    }

    await client.query(
      "UPDATE MEMBER SET award_miles = award_miles - $1 WHERE email = $2",
      [harga_miles, email_member]
    );

    await client.query(
      "INSERT INTO REDEEM (email_member, kode_hadiah, timestamp) VALUES ($1, $2, NOW())",
      [email_member, kode_hadiah]
    );
1
    await client.query('COMMIT');

    return NextResponse.json({ message: "Redeem Berhasil!" }, { status: 200 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    client.release();
  }
}