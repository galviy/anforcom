import {TeamRepository} from "../../../DB/repositories"

const adminRepo = new TeamRepository()

export async function handler(req: Request, json?: any): Promise<Response> {
  
   if (req.method != 'POST')  return new Response(null, {status:404});
   const text = await req.text()
   if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }
  const { tim_id } = JSON.parse(text)
  if (!tim_id ) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })

  let result2 = await adminRepo.deleteTeam(tim_id);
  return Response.json({ success: true }, { status: 200 })

}
