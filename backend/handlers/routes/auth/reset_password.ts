import {UserRepository} from '../../../DB/repositories'


const authRepo = new UserRepository()



export async function handler(req: Request): Promise<Response> {
    if (req.method != 'POST')  return new Response(null, {status:404});

    const text = await req.text()
    if (!text) {
        return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
    }
    const { email } = JSON.parse(text)
    if (!email) return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)) return Response.json({ success: false, error: "invalid email struct??" }, { status: 400 })

    const check_exist = await authRepo.findEmail(email);
    const cek_woy = check_exist[0];

    if (cek_woy == null){
     return Response.json({success:false, error: `If an account with that email address exists, we have sent a password reset link.`},{status:400})
    }
    
    return Response.json({ success: false, error: "Not implemented yet moyai :v" }, { status: 501 })

}