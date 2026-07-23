import { administrator } from "../../../DB/admin_repositories"
const adminRepo = new administrator()

export async function handler(req: Request): Promise<Response> {
    if (req.method != 'GET') return new Response(null, { status: 404 });
    const data = await adminRepo.cek_bukti();
    return Response.json({ data });
}