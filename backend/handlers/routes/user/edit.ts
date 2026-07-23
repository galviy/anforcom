// routes/user/index.ts
import { UserRepository } from "../../../DB/repositories"
import {logger} from "../../../logger"
const authRepo = new UserRepository()

export async function handler(req: Request, json: any): Promise<Response> {
  if (req.method !== 'POST') return new Response(null, { status: 404 })

  const text = await req.text()
  if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }


  const { email, password, old_pass, new_pass, no_tlp } = JSON.parse(text)

  if (email) {
    return Response.json({ success: false, error: "Service is not implemented yet!" }, { status: 501 })
  }

  if (password) {
    if (!old_pass || !new_pass) {
      return Response.json({ success: false, error: "This action requires your old password and new password!" },{ status: 400 })
    }
    if(old_pass.length > 250 || new_pass.length > 250) return Response.json({ success: false, error: "Gk kepanjangan itu broo" }, { status: 401 })

    const check = await authRepo.findByUsername(json.username)
    const user = check?.[0]

    if (!user) {
      return Response.json({ success: false, error: "User tidak ditemukan" }, { status: 404 })
    }

    const valid = await Bun.password.verify(old_pass, user.password, "bcrypt")
    if (!valid) {
      return Response.json({ success: false, error: "Password anda salah" }, { status: 400 })
    }

    const hashedPassword = await Bun.password.hash(new_pass, {
      algorithm: "bcrypt",
      cost: 10,
    })

    const result = await authRepo.updatePassword(json.userId, hashedPassword)
    if (result.affectedRows === 0) {
      return Response.json({ success: false, error: "Something went wrong?" }, { status: 500 })
    }
    //edit_password_logs
    if (Bun.env.logging_mode == "true"){
      void logger.sendWebhook(`User ${json.email} just change a password from settings`,Bun.env.edit_password_logs).catch(err => {
        console.error(err);
      });
    }
    return Response.json({ success: true, message: "Successfully changed your password!" },
      {
        status: 200,
        headers: {
          "Set-Cookie": "token=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict",
        },
      }
    )
  }

  if (no_tlp) {
    return Response.json({ success: false, error: "Service is not implemented yet!" }, { status: 501 })
  }

  return Response.json({ success: false, error: "What are you looking for?" }, { status: 400 })
}