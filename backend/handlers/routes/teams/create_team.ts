// routes/user/index.ts
import { decryptCookie,parseCookie } from '../../cookies'
import {UserRepository} from "../../../DB/repositories"

const authRepo = new UserRepository()

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
  console.log(decrypted)
  if (!decrypted) {
    return Response.json({ success: false, error: "Session tidak valid" }, { status: 401 })
  }

  try {
    const { team_name, lomba_id } = JSON.parse(text)
    if (!team_name || !lomba_id) return Response.json({ success: false, error: "pilih jenis lomba terlebih dahulu!" }, { status: 401 })
    let json = JSON.parse(decrypted);
    if (!json) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    //console.log(json)
    if (Math.floor(Date.now() / 1000) > json.valid_until) return Response.json({ success: false, error: "inactived session" }, { status: 401 })
  
    if(!json.tingkat_pendidikan) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })

    switch(json.tingkat_pendidikan){
        case 1:{
            if (lomba_id == 1 || lomba_id == 3) return Response.json({ success: false, error: "Saat ini kamu terdaftar sebagai Kategori (Sarjana),lomba tersebut hanya tersedia untuk kategori SMA/Sederajat!" }, { status: 401 })
               const result = await authRepo.createTeam(json.tingkat_pendidikan, json.userId, team_name, lomba_id);

              if (!result) return Response.json({ success: false, error: "internal server error" }, { status: 500 })
              return Response.json(result);
           } break;
        case 2:{
            if (lomba_id == 2) return Response.json({ success: false, error: "Saat ini kamu terdaftar sebagai Kategori (SMA/Sederajat), lomba tersebut hanya tersedia untuk kategori Sarjana!" }, { status: 401 })
              const result = await authRepo.createTeam(json.tingkat_pendidikan, json.userId, team_name, lomba_id);
              if (!result) return Response.json({ success: false, error: "internal server error" }, { status: 500 })
              return Response.json(result);
        } break;

        default:{
          return Response.json({ success: false, error: "invalid data struct??" }, { status: 401 })
        } break;
    }

  } catch(e){
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }
  
}

