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

  switch(parseInt(lomba_id)){
    case 1:{
         const p = await emailrepo.sendResetAccountVerification(email,"Diponegoro UI/UX Competition (DUC)")
         console.log(p)
    } break

    case 2:{
         const p = await emailrepo.sendResetAccountVerification(email,"Diponegoro Competitive Programming Competition (DCPC)")
         console.log(p)
    } break;

    case 3:{
        const p = await emailrepo.sendResetAccountVerification(email,"Diponegoro Software Development Competition (DSPC)")
        console.log(p)
    } break;
    default:{{
        
    }}
  }
 
  return Response.json({ success: true }, { status: 200 })

}
