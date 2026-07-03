export async function POST({ request }: any) {
  const body = await request.json();

  return Response.json({
    success: true,
    paymentId: crypto.randomUUID(),
    ...body,
  });
}