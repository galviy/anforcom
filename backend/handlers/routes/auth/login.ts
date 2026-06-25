export async function handler(req: Request): Promise<Response> {
  const body = await req.json()

  return Response.json({ success: true })
}
