import {UserRepository} from '../../../DB/repositories'
import {encryptCookie} from '../../cookies'


const authRepo = new UserRepository()



export async function handler(req: Request): Promise<Response> {

  const text = await req.text()
  if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }

  const { username, password } = JSON.parse(text)

  if (!username || !password) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }
  if (username.length < 3 || username.length > 100) {
    return Response.json({ success: false, error: "Username/password harus 3-100 karakter" }, { status: 400 })
  }
  if (password.length < 5 || password.length > 250) {
    return Response.json({ success: false, error: "Password harus 8-250 karakter" }, { status: 400 })
  }
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if(emailRegex.test(username)){
    const rows = await authRepo.findEmail(username);
    const user = rows[0];
    if(!user)  return Response.json({ success: false, error: "invalid email or password??" }, { status: 401 })
    const valid = await Bun.password.verify(password, user.password, "bcrypt")
    if (!valid) {
      return Response.json({ success: false, error: "email atau password salah" }, { status: 401 })
    }

    const payload = JSON.stringify({ userId: user.id, username: user.username,email: user.email,no_tlp:user.no_tlp,tingkat_pendidikan:user.tingkat_pendidikan_id,valid_until:Math.floor(Date.now() / 1000) + 60 * 60})

    const encrypted = await encryptCookie(payload)


    return Response.json({ success: true }, {
      headers: {
        'Set-Cookie': `session=${encrypted}; HttpOnly; Path=/; Max-Age=86400`
      }
    })
  } else {
    const rows = await authRepo.findByUsername(username)
    const user = rows[0]
    

    if (!user) {
      return Response.json({ success: false, error: "invalid username or password??" }, { status: 401 })
    }
    const valid = await Bun.password.verify(password, user.password, "bcrypt")
    if (!valid) {
      return Response.json({ success: false, error: "Username atau password salah" }, { status: 401 })
    }

    const payload = JSON.stringify({ userId: user.id, username: user.username,email: user.email,no_tlp:user.no_tlp,tingkat_pendidikan:user.tingkat_pendidikan_id,valid_until:Number(Math.floor(Date.now() / 1000) + 60*30) })

     const encrypted = await encryptCookie(payload)

     return Response.json({ success: true }, {
      headers: {
        'Set-Cookie': `session=${encrypted}; HttpOnly; Path=/; Max-Age=86400`
      }
    })
  }
  
}
/*
INSERT INTO user (username, password, email, no_tlp, tingkat_pendidikan_id) 
VALUES ('galvin', '$2a$12$w0Jc6s4fMJbff9qmiWVsIu0Fzt71Pz9NEFh8sip6iTWvD.78RBW3a', 'galvindoser@gmail.com', '085892297874', 1);
*/
