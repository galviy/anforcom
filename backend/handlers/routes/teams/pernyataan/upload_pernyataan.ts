import {TeamRepository} from "../../../../DB/repositories"

const authRepo = new TeamRepository()

const allowedTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const allowedExtensions = new Set([
  "pdf", 
  "jpg",
  "jpeg",
  "png",
  "webp",
]);



export async function handler(req: Request, json?: any): Promise<Response> {
   if (req.method != 'POST')  return new Response(null, {status:404});
  
  const formdata = await req.formData(); 
  if (!formdata.get("data_receipt")) {
      return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
  }

  const receipt = formdata.get("data_receipt") as File;
  if (!receipt || !(receipt instanceof File)) {
    return Response.json({ success: false, error: "File tidak ditemukan" }, { status: 400 });
  }

  const ext = receipt.name.split('.').pop()?.toLowerCase() ?? '';
  
  if (!allowedTypes.has(receipt.type) || !allowedExtensions.has(ext)) {
    return Response.json({ success: false, error: "Tipe file tidak didukung" }, { status: 400 });
  }

  if (receipt instanceof File) {

    let tim_id = Number(formdata.get("tim_id"));

    let ukuran_receipt = receipt.size / (1000 * 1000);
    
    if(tim_id > 2147483647 || tim_id < 0) return Response.json({ success: false, error: "yang make sense aja gabisa kah brooo?" }, { status: 400 })

    let result = await authRepo.timIdCheck(json.userId, Number(tim_id));
    if (result.length == 0) return Response.json({ success: false, error: "hayo pentester kah bang??" }, { status: 403 });

    console.log(`tim_id: ${tim_id}\nUkuran receipt: ${ukuran_receipt} MB\nnama_file: ${receipt.name}`);
    
    if (ukuran_receipt >= 10) return Response.json({ success: false, error: `file size is way too big ${ukuran_receipt}, max nya 10 mb boy bisa kasih compress tah?` });
    
    let nama_file = `${crypto.randomUUID()}.${ext}`;
    let up_receipt = await authRepo.upload_pernyataan(tim_id,receipt,nama_file)
    if (up_receipt.success) {
        return Response.json({ success: true, message: `Uploaded ${receipt.name} with size of ${ukuran_receipt}`, nama_file: `${nama_file}` }, { status: 200 });
    }
    return Response.json(up_receipt)
  }
  return Response.json({ success: false }, { status: 403 })
}


/*
curl -X POST http://127.0.0.1:1337/api/teams/pembayaran/add_pembayaran \
-H "Cookie: session=active_session" \
-F "tim_id=409" \
-F "data_photo=@$HOME/Downloads/file.jpg;type=image/jpeg"
*/

