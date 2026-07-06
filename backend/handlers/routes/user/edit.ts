// routes/user/index.ts
import {auth, UserRepository} from "../../../DB/repositories"


const authRepo = new UserRepository()

export async function handler(req: Request, json: any): Promise<Response> {
  if (req.method != 'POST') return new Response(null, {status:404});
  const text = await req.text()
  if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }

  try {
    const { email,password,no_tlp } = JSON.parse(text)
    if(email) 
        return Response.json({ success: false, error: "Service is not implemented yet!" }, { status: 501 })
    if(password) {
        const { old_pass } = JSON.parse(text);
        if(!old_pass) Response.json({ success: false, error: "This action require your old pass!" }, { status: 400 }) 
        let check = await authRepo.findByUsername(json.username);
        const user = check[0]
        const valid = await Bun.password.verify(old_pass, user.password, "bcrypt")
        
        if (!valid) {
            return Response.json({ success: false, error: "Password anda salah" }, { status: 400 })
        }
        //authRepo.updatePassword()


        
    }
       
    
    if(no_tlp)
         return Response.json({ success: false, error: "Service is not implemented yet!" }, { status: 501 })


  } catch(e){
    console.error(e);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }


 
  return Response.json({ username: json.username,email:json.email,no_tlp:json.no_tlp,pendidikan_id:json.tingkat_pendidikan})
}

