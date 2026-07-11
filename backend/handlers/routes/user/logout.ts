// routes/user/index.ts
import { decryptCookie,parseCookie } from '../../cookies'
import {UserRepository} from "../../../DB/repositories"

const authRepo = new UserRepository()


export async function handler(req: Request,json: any): Promise<Response> {
  if (req.method !== 'GET') return new Response(null, { status: 404 });
  
  return new Response("Logged out successfully", {
    status: 302, 
    headers: {
      "Location": "/", 
      "Set-Cookie": "session=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict",
    },
  }); 
}