import {UserRepository} from '../../../DB/repositories'
import {encryptCookie,decryptCookie} from '../../cookies'
import {emailRepositories} from '../../../email/repositories'


const authRepo = new UserRepository()
const emailHandler = new emailRepositories();

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function handler(req: Request): Promise<Response> {
    if (req.method != 'POST')  return new Response(null, {status:404});

    const text = await req.text()
    if (!text) {
        return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
    }
    const { email } = JSON.parse(text)
    if (!email) return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
    if(!emailRegex.test(email)) return Response.json({ success: false, error: "invalid email struct??" }, { status: 400 })


    const payload = JSON.stringify({ valid_until:Math.floor(Date.now() / 1000) + 60 * 60})
    let generate_token = await encryptCookie(payload);

    const sendwoy = await authRepo.createPasswordResetToken(email,generate_token)
    
    if(sendwoy.success) {
        void emailHandler.sendResetAccountVerification(email,generate_token).catch(err => {
            console.error(err);
        });
    }
    return Response.json({success:true, error: `If an account with that email address exists, we have sent a password reset link.`},{status:200})
    
}