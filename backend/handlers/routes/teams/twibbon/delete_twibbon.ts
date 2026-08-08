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

  let result2 = await authRepo.deleteTwibbon(user_id);
  if(!result2.success) return Response.json(result2, { status: 404 })
  
  return Response.json(result2, { status: 200 })

}

