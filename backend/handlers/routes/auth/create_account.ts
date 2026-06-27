import {UserRepository} from '../../../DB/repositories'

const authRepo = new UserRepository()

export async function handler(req: Request): Promise<Response> {

  const text = await req.text()
  if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }

  const { username, password,email,no_tlp,tingkat_pendidikan } = JSON.parse(text)
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return Response.json({success:false,error:"invalid email ???"},{status:400});
  if (!username || !password || !email || !no_tlp || !tingkat_pendidikan) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }
  
  const rows = await authRepo.findByUsername(username)
  const user = rows[0]
  if (user != null){
    return Response.json({success:false, error: `user ${username} already exist!`},{status:400})
  }
  const rows2 = await authRepo.findEmail(email);
  const user2 = rows2[0];
  if (user2 != null){
     return Response.json({success:false, error: `email ${email} already exist!`},{status:400})
  }
  const rows3 = await authRepo.findPhoneNumber(no_tlp);
  const user3 = rows3[0];

  if (user3 != null){
    return Response.json({success:false, error: `phone number ${no_tlp} has already exist!`},{status:400})
  }
  const parseinteger = Number(tingkat_pendidikan);
  if (parseinteger >= 0 && parseinteger <= 2){ 
    try {
        const rows4 = await authRepo.create_account(username,password,email,no_tlp,tingkat_pendidikan);
        const user4 = rows4[0];
       
        return Response.json({success:true,message: `Successfully created ${username} please relogin to get session_id`},{status:200})
    } catch(e){
      console.error(e)
      return Response.json({success:false, error: `internal server error`},{status:500}) 
    }
   

  } else {
    return Response.json({success:false, error: `invalid pendidikan id??`},{status:400}) 
  }
  
}
/*
INSERT INTO user (username, password, email, no_tlp, tingkat_pendidikan_id) 
VALUES ('galvin', '$2a$12$w0Jc6s4fMJbff9qmiWVsIu0Fzt71Pz9NEFh8sip6iTWvD.78RBW3a', 'galvindoser@gmail.com', '085892297874', 1);
*/
