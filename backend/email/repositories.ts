import {email} from "."

// RLU frontend tempat halaman /reset-password berjalan.
// - Dev: frontend jalan terpisah lewat Vite (default port 5173)
// - Prod: frontend (dist/) di-serve langsung oleh backend ini, jadi origin-nya sama
const FRONTEND_URL = Bun.env.FRONTEND_URL || "https://app.anforcom.com"

export class emailRepositories{
  

  async sendEmailVerification(emailName: string,token:string) {
    const verifyLink = `${FRONTEND_URL}/verify-success?token=${token}`

    await email.send({
        to: emailName,
        subject: "Anforcom Account Creation!",
        html: `<p>Terima kasih sudah mendaftar di Anforcom! Klik tombol di bawah untuk mengaktifkan akun kamu,jika kamu merasa tidak mendaftarkan email ini lebih baik kamu hiraukan saja :v</p>
        <p><a href="${verifyLink}" style="display:inline-block;padding:10px 20px;background:#f5a623;color:#0a1022;font-weight:bold;text-decoration:none;border-radius:6px;">Verifikasi Email</a></p>
        <p>Atau salin link ini ke browser: ${verifyLink}</p>`,
      });
  }

  async sendResetAccountVerification(emailName: string,token:string) {
    // PENTING: harus mengarah ke halaman reset-password di FRONTEND (yang lalu
    // memanggil POST /api/auth/reset_confirmation?token=...), BUKAN ke
    // /api/auth/verification — endpoint itu untuk verifikasi akun baru dan
    // mengecek tabel `dummy_user`, sedangkan token reset password disimpan di
    // tabel `changepass_dummy`. Memakai link yang salah selalu menghasilkan
    // "Token verifikasi tidak valid." walau token reset-nya sendiri valid.
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`
    await email.send({
        to: emailName,
        subject: "Anforcom Reset Account!",
        html: `<p>Kami menerima permintaan reset password untuk akun Anforcom kamu. Klik tombol di bawah untuk membuat password baru (tautan berlaku 30 menit):</p>
        <p><a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#f5a623;color:#0a1022;font-weight:bold;text-decoration:none;border-radius:6px;">Reset Password</a></p>
        <p>Atau salin link ini ke browser: ${resetLink}</p>
        <p>Kalau kamu tidak merasa meminta ini, abaikan saja email ini.</p>`,
      });
  }
}