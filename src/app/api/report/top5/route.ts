import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT email, total_miles 
      FROM MEMBER 
      ORDER BY total_miles DESC 
      LIMIT 5
    `);
    
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}