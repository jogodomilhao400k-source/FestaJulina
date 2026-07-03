export default async function handler(req: any, res: any) {
  const body = req.body;

  res.status(200).json({
    success: true,
    paymentId: crypto.randomUUID(),
    ...body,
  });
}