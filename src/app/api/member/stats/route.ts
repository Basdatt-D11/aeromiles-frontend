import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) return Response.json({ error: "Email required" }, { status: 400 });

  try {
    const result = await pool.query(
      `SELECT m.nomor_member as no_member, t.nama as tier, m.total_miles, m.award_miles
       FROM member m
       LEFT JOIN tier t ON m.id_tier = t.id_tier
       WHERE m.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return Response.json({ no_member: "N/A", tier: "Blue", award_miles: 0, total_miles: 0 });
    }

    return Response.json(result.rows[0]);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
