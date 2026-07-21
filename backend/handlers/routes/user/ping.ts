// routes/user/index.ts
import {encryptCookie} from '../../cookies'


export async function handler(req: Request, json: any): Promise<Response> {
  if (req.method != 'GET') return new Response(null, {status:404});
  //const payload: any = JSON.stringify(json);

  let payload = json
  if (payload.extend == null && payload.extend > 6){
    return new Response("u gotta be afk right??", {
        status: 302, 
        headers: {
            "Location": "/", 
            "Set-Cookie": "session=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict",
        },
    }); 
  }
  if (payload.valid_until != null || payload.valid_until >= Date.now()/1000){
    payload.valid_until = Math.floor(Date.now() / 1000) + 15 * 60;
    payload.extend+=1;
    const dataString = JSON.stringify(payload);
    const encrypted = await encryptCookie(dataString)
    return Response.json({ success: true}, {
        headers: {
          'Set-Cookie': `session=${encrypted}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`
        }
    })
  }
  return new Response("no ping for 30 minute? u gotta be afk right? come re-login", {
        status: 302, 
        headers: {
            "Location": "/", 
            "Set-Cookie": "session=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict",
        },
    }); 
}

