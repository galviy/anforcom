import {TeamRepository} from "../../../DB/repositories"

const authRepo = new TeamRepository()

const allowedTypes = new Set([
  "application/pdf",
]);

const allowedExtensions = new Set([
  "pdf",
]);

let folder_upload = "../../../../data_ktm";

export async function handler(req: Request, json?: any): Promise<Response> {
   if (req.method != 'POST')  return new Response(null, {status:404});
  
  const formdata = await req.formData(); 
  if (!formdata.get("data_proposal")) {
      return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
  }

  const proposal = formdata.get("data_proposal") as File;
  if (!proposal || !(proposal instanceof File)) {
    return Response.json({ success: false, error: "File tidak ditemukan" }, { status: 400 });
  }

  const ext = proposal.name.split('.').pop()?.toLowerCase() ?? '';
  
  if (!allowedTypes.has(proposal.type) || !allowedExtensions.has(ext)) {
    return Response.json({ success: false, error: "Tipe file tidak didukung" }, { status: 400 });
  }

  if (proposal instanceof File) {

    let tim_id = Number(formdata.get("tim_id"));

    let ukuran_proposal = proposal.size / (1000 * 1000);
    
    if(tim_id > 2147483647 || tim_id < 0) return Response.json({ success: false, error: "yang make sense aja gabisa kah brooo?" }, { status: 400 })

    let result = await authRepo.timIdCheck(json.userId, Number(tim_id));
    if (result.length == 0) return Response.json({ success: false, error: "hayo pentester kah bang??" }, { status: 403 });
    let apakahbisaup = await authRepo.bisaUpProposal(Number(tim_id))

    if (!apakahbisaup.success) return Response.json({ apakahbisaup });

    console.log(`tim_id: ${tim_id}\nUkuran proposal: ${ukuran_proposal} MB\nnama_file: ${proposal.name}`);
    
    if (ukuran_proposal >= 50) return Response.json({ success: false, error: `file size is way too big ${ukuran_proposal}, max nya 50 mb boy bisa kasih compress tah?` });
    
    let nama_file = `${crypto.randomUUID()}.${ext}`;
    let up_proposal = await authRepo.upload_proposal(Number(tim_id),proposal,nama_file)
    if (up_proposal.success) {
        return Response.json({ success: true, message: `Uploaded ${proposal.name} with size of ${ukuran_proposal}`, nama_file: `${nama_file}` }, { status: 200 });
    }
    return Response.json(up_proposal)
  }
  return Response.json({ success: false }, { status: 403 })
  
}


/*
curl -X POST http://127.0.0.1:1337/api/teams/add_proposal \
-H "Cookie: session=active_session" \
-F "tim_id=409" \
-F "data_photo=@$HOME/Downloads/file.jpg;type=image/jpeg"
*/

