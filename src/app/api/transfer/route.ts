import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return Response.json({ success: false, message: "Email tidak boleh kosong." }, { status: 400 });
    }

    const result = await pool.query(
      `
      SELECT *,
        CASE
          WHEN LOWER(email_member_1) = LOWER($1) THEN 'Kirim'
          ELSE 'Terima'
        END as transfer_type
      FROM transfer
      WHERE LOWER(email_member_1) = LOWER($1)
         OR LOWER(email_member_2) = LOWER($1)
      ORDER BY transfer_timestamp DESC
      `,
      [email]
    );

    return Response.json({ success: true, history: result.rows });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Terjadi error" }, { status: 500 });
  }
}

export async function POST(req: Request) {

  const client = await pool.connect();

  try {

    const body = await req.json();

    const {
      email_member_1,
      email_member_2,
      jumlah,
      catatan
    } = body;

    // Call stored procedure
    const result = await client.query(
      'SELECT transfer_miles($1, $2, $3, $4) AS message',
      [email_member_1, email_member_2, jumlah, catatan || '-']
    );

    return Response.json({
      success: true,
      message: result.rows[0].message
    });

  } catch (error: any) {

    console.error(error);

    return Response.json({
      success: false,
      message: error.message || "Terjadi error"
    });

  } finally {

    client.release();
  }
}