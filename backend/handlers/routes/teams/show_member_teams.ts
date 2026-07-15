import {TeamRepository} from "../../../DB/repositories"


const authRepo = new TeamRepository()

interface isi_tim {
  id: number;
  nama_lengkap: string;
  asal_instansi:string;
  nomor_induk:string;
  data_image:string;
}

export async function handler(req: Request, json?: any): Promise<Response> {
  
  if (req.method != 'POST')  return new Response(null, {status:404});
  const text = await req.text()
  if (!text) {
    return Response.json({ success: false, error: "invalid data struct??" }, { status: 400 })
  }

  const { tim_id } = JSON.parse(text)
  if (!tim_id ) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
  if(tim_id > 10000) return Response.json({ success: false, error: "Gk kepanjangan itu broo" }, { status: 401 })
  let result = await authRepo.timIdCheck(json.userId,Number(tim_id));
  
  if (result.length == 0) return Response.json({ success: false, error: "hayo pentester kah bang??" }, { status: 403 }) 
  
  let result2 = await authRepo.isiTimCheck(tim_id);
  let p: isi_tim[] = []; 
  for(let i = 0; i < result2.length; i++){
      p.push({id:result2[i].id,nama_lengkap:result2[i].nama_lengkap,asal_instansi:result2[i].asal_instansi,nomor_induk:result2[i].nomor_induk,data_image:result2[i].data_image});
  }
  return Response.json({ success: true, data: p }, { status: 200 })

}

