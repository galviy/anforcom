// routes/user/index.ts
import {UserRepository} from "../../../DB/repositories"


const authRepo = new UserRepository()

export async function handler(req: Request, json: any): Promise<Response> {
  if (req.method != 'GET') return new Response(null, {status:404});
  return Response.json({ username: json.username,email:json.email,no_tlp:json.no_tlp,pendidikan_id:json.tingkat_pendidikan})
}

