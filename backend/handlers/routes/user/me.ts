// routes/user/index.ts
import { parseCookie } from '../../cookies'
import {UserRepository} from "../../../DB/repositories"


const authRepo = new UserRepository()

export async function handler(req: Request, json: any): Promise<Response> {
  if (req.method != 'GET') return new Response(null, {status:404});
  const cookieHeader = req.headers.get('cookie')
  if (!cookieHeader) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }
  const raw = parseCookie(cookieHeader)?.session
  if (!raw) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }
 
  return Response.json({ username: json.username,email:json.email,no_tlp:json.no_tlp,pendidikan_id:json.tingkat_pendidikan})
}

