// routes/user/index.ts
import { decryptCookie,parseCookie } from '../../cookies'
import {TeamRepository} from "../../../DB/repositories"

const authRepo = new TeamRepository()

export const method = 'GET'

interface datar_tim {
  id: number;
  nama_tim: string;
}

export async function handler(req: Request): Promise<Response> {
  const cookieHeader = req.headers.get('cookie')
  
   if (req.method != 'GET')  return new Response(null, {status:404});


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

  try {
   
    
    let json = JSON.parse(decrypted);
    if (!json) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    //console.log(json)
    if (Math.floor(Date.now() / 1000) > json.valid_until) return Response.json({ success: false, error: "inactived session" }, { status: 401 })
    if (!json.username)  return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    const result = await authRepo.findByUsername(json.username);
    //console.log(result);
    let p: datar_tim[] = []; 

    for(let i = 0; i < result.length; i++){
        p.push({id:result[i].id,nama_tim:result[i].nama_tim});
    }
    return Response.json({success:true,data:p},{status:200})
    

  } catch(e){
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }
  
}

