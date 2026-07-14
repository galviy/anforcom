import {UserRepository} from '../../../DB/repositories'
import { decryptCookie } from '../../cookies'


const authRepo = new UserRepository()


export async function handler(req: Request): Promise<Response> {
    if (req.method != 'POST')  return new Response(null, {status:404});

    let url = new URL(req.url);
    const token = url.searchParams.get("token");
    if(!token) return new Response(null, {status:404});
    if(token.length > 250)  return Response.json({ success: false, error: "Gak kepanjangan tuh bro?" }, { status: 400 })
    const text = await req.text()
    if (!text) {
        return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
    }
    let decrypted = await decryptCookie(token)
    if (!decrypted) {
        return Response.json({ success: false, error: "Something went wrong. Maybe your token has expired?" }, { status: 401 })
    }
    let hasil = JSON.parse(decrypted);
    if(!hasil.valid_until) return Response.json({ success: false, error: "Something went wrong. Maybe your token has expired?" }, { status: 401 })
    if (Math.floor(Date.now() / 1000) > hasil.valid_until){
        return Response.json({ success: false, error: "Something went wrong. Maybe your token has expired?" }, { status: 401 })
    
    }
    const { new_password1,new_password2 } = JSON.parse(text)
    if (!new_password1 || !new_password2) return Response.json({ success: false, error: "you need to fill down the password confirmation" }, { status: 400 })
    if (new_password1 != new_password2)  return Response.json({ success: false, error: "Password you have typed does not match" }, { status: 400 })
    const changepewe = await authRepo.reset_password(new_password1,token)

    return Response.json(changepewe,{status:200})
    
}