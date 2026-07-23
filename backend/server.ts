import { Logger } from './logger'
import { StaticHandler } from './handlers/staticHandler'
import { router } from './handlers/router'
import { RateLimiter } from './handlers/middleware'

// boongan, gaada yang di update backend nya
export class Server {
  private logger = new Logger()
  private static_ = new StaticHandler()
  private router = new router();
  private limiter = new RateLimiter(100, 10000);


  private port = Number(Bun.env.Backend_PORT)

  private getClientIP(req: Request, server: Bun.Server<any>): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
      const firstIP = forwarded.split(",")[0]?.trim();
      if (firstIP) return firstIP;
    }
    const realIP = req.headers.get("x-real-ip");
    if (realIP) return realIP;

    return server.requestIP(req)?.address ?? "unknown";
  }

  private async handleRequest(req: Request, server: Bun.Server<any>): Promise<Response> {


    const url = new URL(req.url)
    const pathname = url.pathname

    const ip = this.getClientIP(req, server);
    //console.log(ip)
    if(Bun.env.using_rate_limit == "true"){
      if (!this.limiter.isAllowed(ip)) {
        return new Response(null, { status: 429 });
      }
    }
   

    if (pathname.startsWith("/api/"))
      return this.router.handle(req, pathname, server);
    return this.static_.handle(req, pathname)
  }

  start() {
    Bun.serve({
      port: this.port,
      hostname: "0.0.0.0",
      fetch: (req, server) => this.handleRequest(req, server),
      error: (err) => {
        console.log(err)

        return new Response(null, { status: 500 });
      },
    })

    console.log(`Running at http://localhost:${this.port}`)
  }
  //async connectDB(){
  //const db = new Connect("127.0.0.1",3306,"bank");
  // console.log("Connecting to mariadb")
  // / constructor(ip:string,port:number,db:string){
  // await this.db.connect();
  //}
}