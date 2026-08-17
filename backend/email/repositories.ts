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

  async sendEmailVerifikasiGagal(emailName: string, tipeLomba: string, reason: string) {
    const p = await email.send({to:emailName,subject: `Pendaftaran ${tipeLomba} Gagal Diverifikasi`,
        html: `
          <!DOCTYPE html>
          <html lang="id">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verifikasi Gagal</title>
          </head>
          <body style="margin:0;padding:0;background:#280b0b;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
          <tr>
          <td align="center">
          <table role="presentation" width="620" cellpadding="0" cellspacing="0"
          style="max-width:620px;background:#531414;border-radius:20px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.06);">

          <!-- HEADER -->
          <tr>
          <td align="center" style="background:linear-gradient(180deg,#3f1818 0%,#531414 100%);padding:40px 30px 30px;border-bottom:1px solid rgba(255,255,255,.08);">
          <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
          <td style="font-size:13px;letter-spacing:2px;color:#EAB308;font-weight:bold;text-transform:uppercase;padding-bottom:14px;">
          ANFORCOM <span style="color:#ffffff;">2026</span>
          </td>
          </tr>
          </table>
          <img
          src="https://app.anforcom.com/assets/HERO_mascot-CBwIzS76.PNG"
          alt="ANFORCOM Mascot"
          width="140"
          style="display:block;margin:0 auto 20px;filter:drop-shadow(0 0 18px rgba(234,179,8,.35));">
          <h1 style="margin:0 0 8px;font-size:28px;color:#ffffff;font-weight:bold;">
          Verifikasi <span style="color:#F87171;">Gagal</span>
          </h1>
          <p style="margin:0;font-size:15px;color:#FECACA;">
          Ada beberapa hal yang perlu diperbaiki
          </p>
          </td>
          </tr>

          <!-- CONTENT -->
          <tr>
          <td style="padding:36px 40px 8px;background:#3f0f0f;">
          <p style="margin:0;font-size:16px;color:#F5E5E5;">
          Halo <strong style="color:#ffffff;">${emailName}</strong>,
          </p>
          <p style="margin-top:16px;font-size:15px;line-height:1.8;color:#D9B7B7;">
          Mohon maaf, proses verifikasi administrasi tim Anda untuk lomba
          <strong style="color:#F87171;">${tipeLomba}</strong> pada
          <strong style="color:#ffffff;">ANFORCOM 2026</strong> belum dapat kami setujui.
          </p>

          <!-- REASON CARD -->
          <table width="100%" cellpadding="0" cellspacing="0"
          style="margin:26px 0;background:rgba(255,255,255,.04);border:1px solid rgba(248,113,113,.25);border-radius:14px;">
          <tr>
          <td style="padding:22px 24px;">
          <h3 style="margin:0 0 14px;color:#F87171;font-size:14px;letter-spacing:.5px;text-transform:uppercase;">
          Alasan Penolakan
          </h3>
          <p style="margin:0;font-size:15px;color:#F5E5E5;line-height:1.8;">
          ${reason}
          </p>
          </td>
          </tr>
          </table>

          <!-- ALERT: KELENGKAPAN DOKUMEN -->
          <table width="100%" cellpadding="0" cellspacing="0"
          style="background:rgba(234,179,8,.10);border-left:4px solid #EAB308;border-radius:10px;margin-bottom:26px;">
          <tr>
          <td style="padding:18px 20px;">
          <p style="margin:0;font-size:15px;font-weight:bold;color:#EAB308;">
          Perhatian!!
          </p>
          <p style="margin:10px 0 0;color:#E3D5A3;line-height:1.8;font-size:14px;">
          Mohon pastikan Anda telah melengkapi dan mengunggah ulang seluruh dokumen berikut dengan benar melalui dashboard peserta:
          </p>
          <p style="margin:10px 0 0;color:#E3D5A3;line-height:1.8;font-size:14px;">
          <strong style="color:#ffffff;">✓ Twibbon</strong><br>
          <strong style="color:#ffffff;">✓ Kartu Tanda Mahasiswa/Siswa (KTM)</strong><br>
          <strong style="color:#ffffff;">✓ Bukti Pembayaran</strong>
          </p>
          </td>
          </tr>
          </table>

          <!-- BUTTON -->
          <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
          <td align="center" style="padding-bottom:8px;">
          <a href="${FRONTEND_URL}"
          style="
          display:inline-block;
          background:#EAB308;
          color:#3f0f0f;
          text-decoration:none;
          padding:15px 40px;
          font-size:16px;
          font-weight:bold;
          border-radius:10px;
          box-shadow:0 8px 20px rgba(234,179,8,.25);
          ">
          Perbaiki Sekarang →
          </a>
          </td>
          </tr>
          </table>

          <p style="
          margin-top:32px;
          font-size:14px;
          line-height:1.8;
          color:#C29999;
          ">
          Jika ada pertanyaan terkait alasan penolakan di atas, silakan hubungi panitia
          <strong style="color:#EAB308;">ANFORCOM 2026</strong> melalui kontak resmi yang tersedia.
          </p>
          </td>
          </tr>

          <!-- FOOTER -->
          <tr>
          <td align="center"
          style="background:#280b0b;padding:26px;border-top:1px solid rgba(255,255,255,.06);">
          <p style="margin:0;font-size:13px;color:#A97F7F;">
          Email ini dikirim secara otomatis oleh sistem <strong style="color:#FECACA;">ANFORCOM 2026</strong>.
          </p>
          <p style="margin-top:6px;font-size:12px;color:#7A5555;">
          Mohon tidak membalas email ini.
          </p>
          </td>
          </tr>

          </table>
          </td>
          </tr>
          </table>
          </body>
          </html>
      `,
      
    });
    return p
  }
  async sendEmailVerifikasiBerhasil(emailName: string,tipeLomba: string) {
    const p = await email.send({to:emailName,subject: `Pendaftaran ${tipeLomba} Berhasil Diverifikasi`,
        html: `
          <!DOCTYPE html>
          <html lang="id">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pendaftaran Berhasil</title>
          </head>
          <body style="margin:0;padding:0;background:#0b2818;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
          <tr>
          <td align="center">
          <table role="presentation" width="620" cellpadding="0" cellspacing="0"
          style="max-width:620px;background:#14532d;border-radius:20px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.06);">

          <!-- HEADER -->
          <tr>
          <td align="center" style="background:linear-gradient(180deg,#183f26 0%,#14532d 100%);padding:40px 30px 30px;border-bottom:1px solid rgba(255,255,255,.08);">
          <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
          <td style="font-size:13px;letter-spacing:2px;color:#EAB308;font-weight:bold;text-transform:uppercase;padding-bottom:14px;">
          ANFORCOM <span style="color:#ffffff;">2026</span>
          </td>
          </tr>
          </table>
          <img
          src="https://app.anforcom.com/assets/HERO_mascot-CBwIzS76.PNG"
          alt="ANFORCOM Mascot"
          width="140"
          style="display:block;margin:0 auto 20px;filter:drop-shadow(0 0 18px rgba(234,179,8,.35));">
          <h1 style="margin:0 0 8px;font-size:28px;color:#ffffff;font-weight:bold;">
          Pendaftaran <span style="color:#EAB308;">Berhasil</span>
          </h1>
          <p style="margin:0;font-size:15px;color:#BBF7D0;">
          Selamat datang di ANFORCOM 2026 
          </p>
          </td>
          </tr>

          <!-- CONTENT -->
          <tr>
          <td style="padding:36px 40px 8px;background:#0f3822;">
          <p style="margin:0;font-size:16px;color:#E5F5EA;">
          Halo <strong style="color:#ffffff;">${emailName}</strong>,
          </p>
          <p style="margin-top:16px;font-size:15px;line-height:1.8;color:#B7D9C2;">
          Selamat! Seluruh proses verifikasi administrasi tim Anda telah berhasil diselesaikan.
          </p>
          <p style="font-size:15px;line-height:1.8;color:#B7D9C2;">
          Tim Anda kini telah <strong style="color:#ffffff;">resmi terdaftar</strong> sebagai peserta lomba
          <strong style="color:#EAB308;">${tipeLomba}</strong> pada
          <strong style="color:#ffffff;">ANFORCOM 2026</strong>.
          </p>

          <!-- STATUS CARD -->
          <table width="100%" cellpadding="0" cellspacing="0"
          style="margin:26px 0;background:rgba(255,255,255,.04);border:1px solid rgba(234,179,8,.25);border-radius:14px;">
          <tr>
          <td style="padding:22px 24px;">
          <h3 style="margin:0 0 14px;color:#EAB308;font-size:14px;letter-spacing:.5px;text-transform:uppercase;">
          Dokumen yang Telah Diverifikasi
          </h3>
          <p style="margin:8px 0;font-size:15px;color:#E5F5EA;">
          <span style="color:#4ADE80;font-weight:bold;">✓</span>&nbsp; Bukti Pembayaran
          </p>
          <p style="margin:8px 0;font-size:15px;color:#E5F5EA;">
          <span style="color:#4ADE80;font-weight:bold;">✓</span>&nbsp; Kartu Tanda Mahasiswa (KTM)
          </p>
          </td>
          </tr>
          </table>

          <!-- ALERT -->
          <table width="100%" cellpadding="0" cellspacing="0"
          style="background:rgba(234,179,8,.10);border-left:4px solid #EAB308;border-radius:10px;margin-bottom:26px;">
          <tr>
          <td style="padding:18px 20px;">
          <p style="margin:0;font-size:15px;font-weight:bold;color:#EAB308;">
          Perhatian!!
          </p>
          <p style="margin:10px 0 0;color:#E3D5A3;line-height:1.8;font-size:14px;">
          Apabila kategori lomba yang Anda ikuti <strong style="color:#ffffff;">memerlukan proposal</strong>,
          mohon segera mengunggah proposal melalui dashboard peserta
          <strong style="color:#ffffff;">sebelum 31 Agustus 2026 pukul 23.59 WIB</strong>.
          </p>
          </td>
          </tr>
          </table>

          <!-- BUTTON -->
          <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
          <td align="center" style="padding-bottom:8px;">
          <a href="${FRONTEND_URL}"
          style="
          display:inline-block;
          background:#EAB308;
          color:#14532d;
          text-decoration:none;
          padding:15px 40px;
          font-size:16px;
          font-weight:bold;
          border-radius:10px;
          box-shadow:0 8px 20px rgba(234,179,8,.25);
          ">
          Buka Dashboard →
          </a>
          </td>
          </tr>
          </table>

          <p style="
          margin-top:32px;
          font-size:14px;
          line-height:1.8;
          color:#9CC5AA;
          ">
          Terima kasih telah menjadi bagian dari <strong style="color:#EAB308;">ANFORCOM 2026</strong>.
          Kami berharap dapat bertemu dengan tim Anda pada rangkaian kompetisi nanti. Semoga sukses!
          </p>
          </td>
          </tr>

          <!-- FOOTER -->
          <tr>
          <td align="center"
          style="background:#0b2818;padding:26px;border-top:1px solid rgba(255,255,255,.06);">
          <p style="margin:0;font-size:13px;color:#7FA98D;">
          Email ini dikirim secara otomatis oleh sistem <strong style="color:#BBF7D0;">ANFORCOM 2026</strong>.
          </p>
          <p style="margin-top:6px;font-size:12px;color:#557A63;">
          Mohon tidak membalas email ini.
          </p>
          </td>
          </tr>

          </table>
          </td>
          </tr>
          </table>
          </body>
          </html>
      `,
      
    });
    return p
  }
  async sendEmailPengumuman(emailName: string,
    params: {
      subject: string;
      title: string;           // judul besar di header, misal "Pengumuman Penting"
      highlightWord?: string;  // kata yang di-highlight warna kuning di title, opsional
      greetingName: string;    // nama penerima buat "Halo <nama>,"
      message: string;         // isi pesan utama (bisa multi-paragraf, pisahkan pakai \n\n)
      alertTitle?: string;     // judul box alert kuning, opsional
      alertMessage?: string;   // isi box alert kuning, opsional
      buttonText?: string;     // teks tombol, default "Buka Dashboard"
      buttonUrl?: string;      // url tombol, default FRONTEND_URL
    }
  ) {
    const {
      subject,
      title,
      highlightWord = "",
      greetingName,
      message,
      alertTitle,
      alertMessage,
      buttonText = "Buka Dashboard",
      buttonUrl = FRONTEND_URL,
    } = params;


    const messageHtml = message
      .split(/\n\s*\n/)
      .map(
        (para) => `
          <p style="font-size:15px;line-height:1.8;color:#B7D9C2;margin:12px 0 0;">
            ${para.trim().replace(/\n/g, "<br/>")}
          </p>`
      )
      .join("");

    const p = await email.send({
      to: emailName,
      subject,
      html: `
        <!DOCTYPE html>
        <html lang="id">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        </head>
        <body style="margin:0;padding:0;background:#0b2818;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
        <tr>
        <td align="center">
        <table role="presentation" width="620" cellpadding="0" cellspacing="0"
        style="max-width:620px;background:#14532d;border-radius:20px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.06);">

        <!-- HEADER -->
        <tr>
        <td align="center" style="background:linear-gradient(180deg,#183f26 0%,#14532d 100%);padding:40px 30px 30px;border-bottom:1px solid rgba(255,255,255,.08);">
        <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
        <td style="font-size:13px;letter-spacing:2px;color:#EAB308;font-weight:bold;text-transform:uppercase;padding-bottom:14px;">
        ANFORCOM <span style="color:#ffffff;">2026</span>
        </td>
        </tr>
        </table>
        <img
        src="https://app.anforcom.com/assets/HERO_mascot-CBwIzS76.PNG"
        alt="ANFORCOM Mascot"
        width="140"
        style="display:block;margin:0 auto 20px;filter:drop-shadow(0 0 18px rgba(234,179,8,.35));">
        <h1 style="margin:0 0 8px;font-size:28px;color:#ffffff;font-weight:bold;">
        ${title}${highlightWord ? ` <span style="color:#EAB308;">${highlightWord}</span>` : ""}
        </h1>
        </td>
        </tr>

        <!-- CONTENT -->
        <tr>
        <td style="padding:36px 40px 8px;background:#0f3822;">
        <p style="margin:0;font-size:16px;color:#E5F5EA;">
        Halo <strong style="color:#ffffff;">${greetingName}</strong>,
        </p>
        ${messageHtml}

        ${
          alertTitle || alertMessage
            ? `
        <!-- ALERT -->
        <table width="100%" cellpadding="0" cellspacing="0"
        style="background:rgba(234,179,8,.10);border-left:4px solid #EAB308;border-radius:10px;margin:26px 0;">
        <tr>
        <td style="padding:18px 20px;">
        ${
          alertTitle
            ? `<p style="margin:0;font-size:15px;font-weight:bold;color:#EAB308;">${alertTitle}</p>`
            : ""
        }
        ${
          alertMessage
            ? `<p style="margin:10px 0 0;color:#E3D5A3;line-height:1.8;font-size:14px;">${alertMessage}</p>`
            : ""
        }
        </td>
        </tr>
        </table>`
            : ""
        }

        <!-- BUTTON -->
        <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
        <td align="center" style="padding:16px 0 8px;">
        <a href="${buttonUrl}"
        style="
        display:inline-block;
        background:#EAB308;
        color:#14532d;
        text-decoration:none;
        padding:15px 40px;
        font-size:16px;
        font-weight:bold;
        border-radius:10px;
        box-shadow:0 8px 20px rgba(234,179,8,.25);
        ">
        ${buttonText} →
        </a>
        </td>
        </tr>
        </table>
        </td>
        </tr>

        <!-- FOOTER -->
        <tr>
        <td align="center"
        style="background:#0b2818;padding:26px;border-top:1px solid rgba(255,255,255,.06);">
        <p style="margin:0;font-size:13px;color:#7FA98D;">
        Email ini dikirim secara otomatis oleh sistem <strong style="color:#BBF7D0;">ANFORCOM 2026</strong>.
        </p>
        <p style="margin-top:6px;font-size:12px;color:#557A63;">
        Mohon tidak membalas email ini.
        </p>
        </td>
        </tr>

        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>
      `,
    });
    return p;
  }
}