export async function GET() {
  return Response.json({
    db: process.env.DATABASE_URL
  });
}