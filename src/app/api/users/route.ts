import { pool } from "@/lib/db";

export async function GET() {
  const result = await pool.query(
    "SELECT * FROM pengguna"
  );

  return Response.json(result.rows);
}