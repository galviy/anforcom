import {TeamRepository} from "../../../DB/repositories"

const authRepo = new TeamRepository()

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const allowedExtensions = new Set([
  "jpg", 
  "jpeg", 
  "png",
  "webp"
]);

let folder_upload = "../../../../data_ktm";

export async function handler(req: Request, json?: any): Promise<Response> {
   if (req.method != 'POST') return new Response(null, {status:404});
   const text = await req.text()
   if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
   }
   
   try {
    const { tim_id, user_id,editCase } = JSON.parse(text)
    if (!tim_id || !editCase || !user_id) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    let result = await authRepo.timIdCheck(json.userId, Number(tim_id));
    if (result.length == 0) return Response.json({ success: false, error: "hayo pentester kah bang??" }, { status: 403 });

    switch(editCase){
       
        case "editNama":{
            const {nama_baru} = JSON.parse(text);
            if(!nama_baru) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
            if(nama_baru.length > 250) return Response.json({ success: false, error: "Gk kepanjangan itu broo" }, { status: 401 })
            let gantiNama = await authRepo.updateNama_lengkap(tim_id,user_id,nama_baru);
            return Response.json({gantiNama});
             
          //  const {change_}

        } break;
        case "asal_instansi":{
            const {asal_instansi_baru} = JSON.parse(text);
            if(!asal_instansi_baru) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
            if(asal_instansi_baru.length > 250) return Response.json({ success: false, error: "Gk kepanjangan itu broo" }, { status: 401 })
            let ganti_instansi = await authRepo.updateAsalInstansi(tim_id,user_id,asal_instansi_baru)
            return Response.json({ganti_instansi});

        } break;
        
        case "nomor_induk":{
            const {nomor_induk_baru} = JSON.parse(text);
            if(!nomor_induk_baru) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
            if(nomor_induk_baru.length > 30) return Response.json({ success: false, error: "Gk kepanjangan itu broo" }, { status: 401 })
            let ganti_instansi = await authRepo.update_nomor_induk(tim_id,user_id,nomor_induk_baru)
            return Response.json({ganti_instansi});
        } break;

        case "foto_baru":{
            //const {base64Foto_baru} = JSON.parse(text);
            //let nama_file = `${crypto.randomUUID()}.${ext}`;
           // let up = await authRepo.update_ktm_file(tim_id,user_id,);

            //async update_ktm_file(tim_id: number,user_id:number,nama_ktm:string,imagebase64:string){
            return Response.json({success:true,message:"Soon to be impemented"});
            
        } break;

        default:{
            return Response.json({ success: false, error: "Invalid editCase struct??" }, { status: 401 })
        }
    }
    } catch(e){
        console.error(e)
        return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
    }
  
}

