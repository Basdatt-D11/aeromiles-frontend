import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ success: false }, { status: 400 });

    const result = await pool.query(`
      SELECT 
        t.transfer_timestamp as waktu,
        t.catatan,
        t.jumlah,
        p_other.first_mid_name,
        p_other.last_name,
        p_other.email as other_email,
        CASE WHEN t.email_member_1 = $1 THEN 'Kirim' ELSE 'Terima' END as tipe
      FROM TRANSFER t
      JOIN PENGGUNA p_other ON (
        CASE 
          WHEN t.email_member_1 = $1 THEN t.email_member_2 = p_other.email 
          ELSE t.email_member_1 = p_other.email 
        END
      )
      WHERE t.email_member_1 = $1 OR t.email_member_2 = $1
      ORDER BY t.transfer_timestamp DESC
    `, [email]);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { from_email, to_email, amount, catatan } = body;

    await client.query('BEGIN');

    // 1. Cek saldo pengirim
    const senderRes = await client.query('SELECT award_miles FROM MEMBER WHERE email = $1', [from_email]);
    if (senderRes.rows[0].award_miles < amount) {
      throw new Error("Miles tidak cukup, Than!");
    }

    // 2. Cek penerima wujud ke tak
    const receiverRes = await client.query('SELECT email FROM MEMBER WHERE email = $1', [to_email]);
    if (receiverRes.rowCount === 0) {
      throw new Error("Email penerima tidak terdaftar!");
    }

    // 3. Potong saldo pengirim
    await client.query('UPDATE MEMBER SET award_miles = award_miles - $1 WHERE email = $2', [amount, from_email]);

    // 4. Tambah saldo penerima
    await client.query('UPDATE MEMBER SET award_miles = award_miles + $1 WHERE email = $2', [amount, to_email]);

    // 5. Catat dalam tabel TRANSFER
    await client.query(
      'INSERT INTO TRANSFER (email_member_1, email_member_2, jumlah, catatan, transfer_timestamp) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)',
      [from_email, to_email, amount, catatan]
    );

    await client.query('COMMIT');
    return NextResponse.json({ success: true, message: "Transfer Berhasil!" });
  } catch (error: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  } finally {
    client.release();
  }
}