import {TeamRepository} from "../../../../DB/repositories"
const authRepo = new TeamRepository()

export const method = 'GET'

export async function handler(req: Request, json?: any): Promise<Response> {
  
   if (req.method != 'POST')  return new Response(null, {status:404});
   const text = await req.text()
   if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }
  const { user_id } = JSON.parse(text)

  if (!user_id ) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
  if(Number(user_id) > 10000) return Response.json({ success: false, error: "Gk salah kah itu??" }, { status: 400 })
  let result = await authRepo.cek_upload_valid_twibbon(json.userId,user_id);
  if (!result[0] || result.length == 0|| result[0].total == 0) return Response.json({ success: false, error: "hayo pentester kah bang??" }, { status: 403 });
  //let dah_verif = await authRepo.isVerifiedCek(Number(user_id));
  //if(dah_verif) return Response.json({ success: false, error: "Akun anda telah diverifikasi,anda tidak bisa melakukan delete bukti" }, { status: 401 })
  
  //let result2 = await authRepo.deletePembayaran(user_id);
  
  return Response.json("not implemented yet", { status: 403 })

}

