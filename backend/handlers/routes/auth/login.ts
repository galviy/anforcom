import {UserRepository} from '../../../DB/repositories'
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

  const rows = await authRepo.findByUsername(username)
  const user = rows[0]

  if (!user) {
    return Response.json({ success: false, error: "invalid username or password??" }, { status: 401 })
  }
  //console.log(user)
  const valid = await Bun.password.verify(password, user.password, "bcrypt")
  if (!valid) {
    return Response.json({ success: false, error: "Username atau password salah" }, { status: 401 })
  }

  const sessionId = crypto.randomUUID()

  return Response.json({ success: true }, {
    headers: {
      'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=86400`
    }
  })
}
/*
INSERT INTO user (username, password, email, no_tlp, tingkat_pendidikan_id) 
VALUES ('galvin', '$2a$12$w0Jc6s4fMJbff9qmiWVsIu0Fzt71Pz9NEFh8sip6iTWvD.78RBW3a', 'galvindoser@gmail.com', '085892297874', 1);
*/
