import { TeamRepository } from "../../../DB/repositories"
import { emailRepositories } from "../../../email/repositories"

const adminRepo = new TeamRepository()
const emailrepo = new emailRepositories()

export async function handler(req: Request, json?: any): Promise<Response> {
  if (req.method != 'POST') return new Response(null, { status: 404 });

  const text = await req.text()
  if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }

  const {
    tim_id,
    subject,
    title,
    highlightWord,
    message,
    alertTitle,
    alertMessage,
    buttonText,
    buttonUrl,
  } = JSON.parse(text)

  if (!tim_id || !subject || !title || !message) {
    return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
  }

  let result2 = await adminRepo.getEmailName(tim_id);
  console.log(result2)

  let email = result2[0].email
  let namaTim = result2[0].nama_tim

  if (!email) {
    return Response.json({ success: false, error: `tidak menemukan email dengan id tim ${tim_id}??` }, { status: 401 })
  }

  const p = await emailrepo.sendEmailPengumuman(email, {
    subject,
    title,
    highlightWord,
    greetingName: namaTim,
    message,
    alertTitle,
    alertMessage,
    buttonText,
    buttonUrl,
  })

  const jawaban = p.messageId

  if (jawaban != null) return Response.json({ success: true, message: `${jawaban}` }, { status: 200 })
  return Response.json({ success: true }, { status: 200 })
}