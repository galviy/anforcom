import {TeamRepository} from "../../../DB/repositories"

const adminRepo = new TeamRepository()

export async function handler(req: Request): Promise<Response> {
    if (req.method != 'GET') return new Response(null, { status: 404 });
    
    const url = new URL(req.url);
    const tim_id = Number(url.searchParams.get('tim_id'));
    
    if (!tim_id) return Response.json({ message: "tim_id wajib diisi" }, { status: 400 });
    
    const data = await adminRepo.deleteTeam(tim_id);
    return Response.json({ data });
}