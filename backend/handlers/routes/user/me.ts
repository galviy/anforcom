// routes/user/index.ts
import { decryptCookie,parseCookie } from '../../cookies'
import {UserRepository} from "../../../DB/repositories"

const authRepo = new UserRepository()

export const method = 'GET'

export async function handler(req: Request): Promise<Response> {
  const cookieHeader = req.headers.get('cookie')
  if (!cookieHeader) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const raw = parseCookie(cookieHeader)?.session
  if (!raw) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  let decrypted = await decryptCookie(raw)
  //console.log(decrypted)
  if (!decrypted) {
    return Response.json({ success: false, error: "Session tidak valid" }, { status: 401 })
  }

  let json = JSON.parse(decrypted);
  //console.log(json)
  if (Math.floor(Date.now() / 10000) > json.valid_until) return Response.json({ success: false, error: "inactived session" }, { status: 401 })
  //console.log(json)


  //const {username } = JSON.parse(decrypted)

  return Response.json({ username: json.username,email:json.email,no_tlp:json.no_tlp,pendidikan_id:json.tingkat_pendidikan})
}

