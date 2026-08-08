import {TeamRepository} from "../../../../DB/repositories"

const authRepo = new TeamRepository()
import {logger} from "../../../../logger"

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const allowedExtensions = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
]);


export async function handler(req: Request, json?: any): Promise<Response> {
   if (req.method != 'POST')  return new Response(null, {status:404});
  
  const formdata = await req.formData(); 
  if (!formdata.get("data_twibbon")) {
      return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
  }

  const twibbon = formdata.get("data_twibbon") as File;
  if (!twibbon || !(twibbon instanceof File)) {
    return Response.json({ success: false, error: "File tidak ditemukan" }, { status: 400 });
  }

  const ext = twibbon.name.split('.').pop()?.toLowerCase() ?? '';
  
  if (!allowedTypes.has(twibbon.type) || !allowedExtensions.has(ext)) {
    return Response.json({ success: false, error: "Tipe file tidak didukung" }, { status: 400 });
  }

  if (twibbon instanceof File) {

    let user_id = Number(formdata.get("user_id"));

    let ukuran_twibbon = twibbon.size / (1000 * 1000);
    
    if(user_id > 2147483647 || user_id < 0) return Response.json({ success: false, error: "yang make sense aja gabisa kah brooo?" }, { status: 400 })

    let result = await authRepo.cek_upload_valid_twibbon(json.userId,user_id);

    if (!result[0] || result.length == 0|| result[0].total == 0) return Response.json({ success: false, error: "hayo pentester kah bang??" }, { status: 403 });
    
   // let cekkedua2 = await authRepo.cek_bisa_upload_twibbon(user_id);
    //if(!cekkedua2 || !cekkedua2[0] || cekkedua2[0].tim_lomba != 2) return Response.json({ success: false, error: "Twibbon hanya diperuntukan untuk tim DCPC saja!" }, { status: 403 });
    console.log(`tim_id: ${user_id}\nUkuran twibbon: ${ukuran_twibbon} MB\nnama_file: ${twibbon.name}`);
    
    if (ukuran_twibbon >= 10) return Response.json({ success: false, error: `file size is way too big ${ukuran_twibbon}, max nya 10 mb boy bisa kasih compress tah?` });
   
    let nama_file = `${crypto.randomUUID()}.${ext}`;
    let up_receipt = await authRepo.upload_twibbon(user_id,twibbon,nama_file)
    //console.log(up_receipt)
    if (up_receipt.success) {
      void logger.sendWebhook(`tim_id: ${user_id}\nUkuran receipt: ${ukuran_twibbon} MB\nnama_file: \`${nama_file}\``,Bun.env.twibbon_logs).catch(err => {
        console.error(err);
      });
      return Response.json({ success: true, message: `Uploaded ${twibbon.name} with size of ${ukuran_twibbon}`, nama_file: `${nama_file}` }, { status: 200 });
    }
     return Response.json(up_receipt, { status: 401 })
  }
  return Response.json({ success: false }, { status: 403 })
  
}


/*
curl -X POST http://127.0.0.1:1337/api/teams/twibbon/add_twibbon \
-H "Cookie: session=active_session" \
-F "user_id=409" \
-F "data_photo=@$HOME/Downloads/file.jpg;type=image/jpeg"
*/

