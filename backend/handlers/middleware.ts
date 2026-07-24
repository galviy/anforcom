import { decryptCookie } from './cookies'


export async function isAdminToken(raw: string): Promise<boolean> {
  if (!raw || raw !== Bun.env.Secret_token) {
    return false;
  }
  return true;
}


export async function panitia_token(raw:string){
   if (!raw) {
        return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    try {
      let decrypted = await decryptCookie(raw)
      if (!decrypted) {
        return false
      }
      let json = JSON.parse(decrypted);
      if(!json.valid_until && !json.is_panitia){
        return false;
      }
      if (Math.floor(Date.now() / 1000) > json.valid_until){
        return false;
      }
      return true;
    } catch(e){
       return false
    }
}

export async function session_handler(raw:string){
    if (!raw) {
        return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    try {
        let decrypted = await decryptCookie(raw)
        if (!decrypted) {
            return Response.json({ success: false, error: "Session tidak valid" }, { status: 401 })
        }
        let json = JSON.parse(decrypted);
        if (Math.floor(Date.now() / 1000) > json.valid_until){
            return Response.json({ success: false, error: "inactived session" }, { status: 401 })
        }
        return json;

    } catch(e){
        //console.error(e)
        return Response.json({success:false,error: "Session tidak valid"}, {status: 401})
    }
}

 class RateLimiter {
  private maxRequest: number;
  private windowTime: number;
  private blockDuration: number; 
  private limitData: Map<string, { count: number; resetAt: number; blockedUntil: number }>;

  constructor(maxRequest: number, windowTime: number, blockDuration: number = 10 * 60 * 1000) {
    this.maxRequest = maxRequest;
    this.windowTime = windowTime;
    this.blockDuration = blockDuration; 
    this.limitData = new Map();
  }

  isAllowed(ip: string): boolean {
    const now = Date.now();
    let data = this.limitData.get(ip);


    if (!data) {
      data = { count: 0, resetAt: now + this.windowTime, blockedUntil: 0 };
      this.limitData.set(ip, data);
    }

    if (data.blockedUntil > now) {
      //console.log(`${ip} masih diblokir sampai ${new Date(data.blockedUntil).toLocaleTimeString()}`);
      return false;
    }

    if (now > data.resetAt) {
      data.count = 0;
      data.resetAt = now + this.windowTime;
    }

    data.count++;

    if (data.count > this.maxRequest) {
      data.blockedUntil = now + this.blockDuration;
      //console.log(`${ip} kena blokir ${this.blockDuration / 60000} menit!`);
      return false;
    }

    return true;
  }
}


export { RateLimiter };