import {UserRepository} from "../../../DB/repositories"
const authRepo = new UserRepository()
import {logger} from "../../../logger"
export async function handler(req: Request, json?: any): Promise<Response> {

   
   if (req.method != 'POST')  return new Response(null, {status:404});
   const text = await req.text()
   if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }

  const { team_name, lomba_id } = JSON.parse(text)
  if (!team_name || !lomba_id) return Response.json({ success: false, error: "pilih jenis lomba terlebih dahulu!" }, { status: 401 })

  if(!json.tingkat_pendidikan) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
  if(team_name.length > 30) return Response.json({ success: false, error: "Gk kepanjangan itu broo" }, { status: 401 })
  switch(json.tingkat_pendidikan){
      case 1:{
          if (lomba_id == 2) return Response.json({ success: false, error: "Saat ini kamu terdaftar sebagai Kategori (Sarjana),lomba tersebut hanya tersedia untuk kategori SMA/Sederajat!" }, { status: 401 })
          if (lomba_id > 3)  return Response.json({ success: false, error: "Invalid Lomba ID??" }, { status: 401 })
          const result = await authRepo.createTeam(json.tingkat_pendidikan, json.userId, team_name, lomba_id);

          if (!result) return Response.json({ success: false, error: "internal server error" }, { status: 500 })
          if (Bun.env.logging_mode == "true"){
            void logger.sendWebhook(`${json.username} just Created a tim : ${team_name} dengan lomba id ${lomba_id} `,Bun.env.team_creation_logs).catch(err => {
                console.error(err);
              });
          }
          return Response.json(result);
      } break;
      case 2:{
          if (lomba_id == 3) return Response.json({ success: false, error: "Saat ini kamu terdaftar sebagai Kategori (SMA/Sederajat), lomba tersebut hanya tersedia untuk kategori Sarjana!" }, { status: 401 })
            if (lomba_id > 3)  return Response.json({ success: false, error: "Invalid Lomba ID??" }, { status: 401 })
            const result = await authRepo.createTeam(json.tingkat_pendidikan, json.userId, team_name, lomba_id);
            if (!result) return Response.json({ success: false, error: "internal server error" }, { status: 500 })
            if (Bun.env.logging_mode == "true"){
              void logger.sendWebhook(`${json.username} just Created a tim : ${team_name} dengan lomba id ${lomba_id} }`,Bun.env.team_creation_logs).catch(err => {
                console.error(err);
              });
            }
            return Response.json(result);
      } break;

      default:{
        return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
      } break;
  }

}

