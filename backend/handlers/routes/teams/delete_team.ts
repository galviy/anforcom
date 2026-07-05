import {TeamRepository} from "../../../DB/repositories"
const authRepo = new TeamRepository()

export const method = 'GET'

export async function handler(req: Request, json?: any): Promise<Response> {
  
   const text = await req.text()
   console.log(text)
   if (req.method != 'POST')  return new Response(null, {status:404});
   if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }

 
  
  try {
    const { tim_id } = JSON.parse(text)
    if (!tim_id ) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
   
    let result = await authRepo.timIdCheck(json.userId,Number(tim_id));
    

    if (result.length == 0) return Response.json({ success: false, error: "hayo pentester kah bang??" }, { status: 403 }) 
    
    let result2 = await authRepo.deleteTeam(tim_id);


    return Response.json({ success: true }, { status: 200 })

  } catch(e){
    console.error(e)
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
  
}

