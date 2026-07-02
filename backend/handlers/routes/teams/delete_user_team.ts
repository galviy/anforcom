// routes/user/index.ts
import { decryptCookie,parseCookie } from '../../cookies'
import {TeamRepository} from "../../../DB/repositories"

const authRepo = new TeamRepository()

export const method = 'GET'

export async function handler(req: Request): Promise<Response> {
  const cookieHeader = req.headers.get('cookie')
   const text = await req.text()
   console.log(text)
   if (req.method != 'POST')  return new Response(null, {status:404});
   if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }

  if (!cookieHeader) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const raw = parseCookie(cookieHeader)?.session
  if (!raw) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  let decrypted = await decryptCookie(raw)

  if (!decrypted) {
    return Response.json({ success: false, error: "Session tidak valid" }, { status: 401 })
  }

  try {
    const { tim_id,user_id } = JSON.parse(text)
    if (!tim_id || !user_id ) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    let json = JSON.parse(decrypted);
    if (!json) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    if (!json.userId) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    if (Math.floor(Date.now() / 1000) > json.valid_until) return Response.json({ success: false, error: "inactived session" }, { status: 401 })
    
    let result = await authRepo.timIdCheck(json.userId,Number(tim_id));
    
    console.log(result)
    if (result.length == 0) return Response.json({ success: false, error: "hayo pentester kah bang??" }, { status: 403 }) 
    
    let result2 = await authRepo.deleteUserTeam(tim_id,user_id);


    return Response.json({ success: true }, { status: 404 })

  } catch(e){
    console.error(e)
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
  
}

