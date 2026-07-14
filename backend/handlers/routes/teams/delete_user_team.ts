import {TeamRepository} from "../../../DB/repositories"

const authRepo = new TeamRepository()

export async function handler(req: Request, json?: any): Promise<Response> {
  
  if (req.method != 'POST')  return new Response(null, {status:404});
  const text = await req.text()
  if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }
 
  const { tim_id,user_id } = JSON.parse(text)
  if (!tim_id || !user_id ) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
  if(Number(tim_id) > 10000 || Number(user_id) > 10000) return Response.json({ success: false, error: "Gk salah kah itu??" }, { status: 400 })
  let result = await authRepo.timIdCheck(json.userId,Number(tim_id));

  if (result.length == 0) return Response.json({ success: false, error: "hayo pentester kah bang??" }, { status: 403 }) 
  
  let result2 = await authRepo.deleteUserTeam(tim_id,user_id);
  if (result2.affectedRows == 0){
    return Response.json({ success: false }, { status: 404 })
  }

  return Response.json({ success: true }, { status: 200 })

}

