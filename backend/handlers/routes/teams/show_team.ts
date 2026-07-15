import {TeamRepository} from "../../../DB/repositories"

const authRepo = new TeamRepository()

interface datar_tim {
  id: number;
  nama_tim: string;
  isVerified: boolean;
  proposal:string;
}
/*

export async function handler(req: Request, json?: any): Promise<Response> {
  if (req.method != 'GET')  return new Response(null, {status:404});
  const result = await authRepo.findByUsername(json.username);
  let p: datar_tim[] = []; 

  for(let i = 0; i < result.length; i++){
    let proposal = "";
    if (result[i].tim_lomba == 1){
      const cari_proposal = await authRepo.ambil_proposal(result[i].id)
      if(cari_proposal[0].data_proposal){
          proposal = cari_proposal[0].data_proposal
      }
      
    }
    p.push({id:result[i].id,nama_tim:result[i].nama_tim,isVerified:result[i].isVerified,proposal:proposal});
  }

  return Response.json({success:true,data:p},{status:200})
    

  
}
*/

export async function handler(req: Request, json?: any): Promise<Response> {
  if (req.method != 'GET') return new Response(null, { status: 404 });

  const result = await authRepo.findByUsername(json.username);

  const p = result.map((row: any) => ({
    id: row.id,
    nama_tim: row.nama_tim,
    tipe_lomba: row.tim_lomba,
    isVerified: row.isVerified,
    proposal: row.tim_lomba == 1 ? (row.data_proposal ?? "") : ""
  }));

  return Response.json({ success: true, data: p }, { status: 200 });
}
