import {TeamRepository} from "../../../DB/repositories"
import {emailRepositories} from "../../../email/repositories"
const adminRepo = new TeamRepository()
const emailrepo = new emailRepositories()


export async function handler(req: Request, json?: any): Promise<Response> {
  
   if (req.method != 'POST')  return new Response(null, {status:404});
   const text = await req.text()
   if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }
  const { tim_id } = JSON.parse(text)
  if (!tim_id ) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })

  let result2 = await adminRepo.getEmailName(tim_id);
  console.log(result2)

  let email = result2[0].email
  let lomba_id = result2[0].tim_lomba
  if(!email || !lomba_id  )return Response.json({ success: false, error: `tidak menemukan email dengan id tim ${tim_id}??` }, { status: 401 })
  let jawaban;
  switch(parseInt(lomba_id)){
    case 1:{
         const p = await emailrepo.sendEmailVerifikasiBerhasil(email,"Diponegoro UI/UX Competition (DUC)")
         jawaban = p.messageId
    } break

    case 2:{
         const p = await emailrepo.sendEmailVerifikasiBerhasil(email,"Diponegoro Competitive Programming Competition (DCPC)")
         jawaban = p.messageId
    } break;

    case 3:{
        const p = await emailrepo.sendEmailVerifikasiBerhasil(email,"Diponegoro Software Development Competition (DSPC)")
        jawaban = p.messageId
    } break;
    default:{{
        
    }}
  }
  const gantiStatus = await adminRepo.verify_team(tim_id)
  if(jawaban != null ) return Response.json({ success: true, message: `${jawaban}`}, { status: 200 })
 
  return Response.json({ success: true }, { status: 200 })

}
