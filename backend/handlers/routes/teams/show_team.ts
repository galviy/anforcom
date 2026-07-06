import {TeamRepository} from "../../../DB/repositories"

const authRepo = new TeamRepository()


interface datar_tim {
  id: number;
  nama_tim: string;
  isVerified: boolean;
}

export async function handler(req: Request, json?: any): Promise<Response> {
  if (req.method != 'GET')  return new Response(null, {status:404});

  try {
    const result = await authRepo.findByUsername(json.username);
    let p: datar_tim[] = []; 

    for(let i = 0; i < result.length; i++){
        p.push({id:result[i].id,nama_tim:result[i].nama_tim,isVerified:result[i].isVerified});
    }
    return Response.json({success:true,data:p},{status:200})
    
  } catch(e){
    console.error(e)
   return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
  
}

