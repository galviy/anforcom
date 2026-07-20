import {UserRepository} from '../../../DB/repositories'
import {encryptCookie} from '../../cookies'
import {emailRepositories} from '../../../email/repositories'

const authRepo = new UserRepository()
const emailHandler = new emailRepositories();

export async function handler(req: Request): Promise<Response> {
    if (req.method != 'POST')  return new Response(null, {status:404});

    const text = await req.text()
    if (!text) {
        return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
    }
    const { token } = JSON.parse(text)
    if (!token) return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
    if (token.length > 255) return Response.json({ success: false, error: "Gak kepanjangan tuh bro?" }, { status: 400 })

    const payload = JSON.stringify({ valid_until: Math.floor(Date.now() / 1000) + 60 * 60 })
    let generate_token = await encryptCookie(payload);

    const resendResult = await authRepo.resendVerificationTokenByOldToken(token, generate_token)

    if (!resendResult.success) {
        return Response.json({ success: false, error: resendResult.message }, { status: 404 })
    }

    void emailHandler.sendEmailVerification(resendResult.email, generate_token).catch(err => {
        console.error(err);
    });

    return Response.json({ success: true, message: `Link verifikasi baru telah dikirim ke email kamu.` }, { status: 200 })
}