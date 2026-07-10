import {email} from "."


export class emailRepositories{
  async sendEmailVerification(emailName: string,token:string) {
    await email.send({
        to: emailName,
        subject: "Anforcom Account Creation!",
        html: `<b>Verification Link http://localhost:1337/api/auth/verification?token=${token}</b>`,
      });
  }
}
