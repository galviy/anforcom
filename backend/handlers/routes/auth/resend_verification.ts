import {UserRepository} from '../../../DB/repositories'
import {encryptCookie} from '../../cookies'
import {emailRepositories} from '../../../email/repositories'
import {Cloudflare} from '../../cloudflare'
import {logger} from "../../../logger"

const authRepo = new UserRepository()
const emailHandler = new emailRepositories();

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function handler(req: Request): Promise<Response> {
    if (req.method != 'POST')  return new Response(null, {status:404});

    const text = await req.text()
    if (!text) {
        return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
    }
    const { email, cf_turnstile_token } = JSON.parse(text)
    if (!email || !cf_turnstile_token) return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })

    const cfCheck = await Cloudflare.validate_token(cf_turnstile_token);
    if (!cfCheck?.success) {
        return Response.json({ success: false, error: "Verifikasi captcha gagal, coba lagi" }, { status: 403 })
    }

    if (email.length < 5 || email.length > 250) {
        return Response.json({ success: false, error: "Email harus 5-250 karakter" }, { status: 400 })
    }
    if(!emailRegex.test(email)) return Response.json({ success: false, error: "invalid email struct??" }, { status: 400 })

    const payload = JSON.stringify({ valid_until: Math.floor(Date.now() / 1000) + 60 * 60 })
    let generate_token = await encryptCookie(payload);

    const resendResult = await authRepo.resendVerificationToken(email, generate_token)

    if (resendResult.success) {
        void emailHandler.sendEmailVerification(email, generate_token).catch(err => {
            console.error(err);
        });
        
    }
    if (Bun.env.logging_mode == "true"){
        void logger.sendWebhook(`resent account creation verification to ${email}`,Bun.env.Account_creation_logs).catch(err => {
            console.error(err);
        });
    }
    // Selalu balas pesan generik yang sama baik email ditemukan atau tidak,
    // biar tidak bisa dipakai buat mengecek email mana saja yang sudah terdaftar.
    return Response.json({ success: true, message: `If a pending registration with that email address exists, we have resent the verification link.` }, { status: 200 })
}
