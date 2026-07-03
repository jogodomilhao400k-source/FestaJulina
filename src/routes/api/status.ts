export async function GET() {
  return Response.json({
    status: "approved",
    approved: true,
  });
}